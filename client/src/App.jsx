import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Trophy, Swords, Shield, PlusCircle, BookOpen, Sparkles, Timer, Shuffle, Radio, Lock, Unlock } from 'lucide-react';
import Bracket from './components/Bracket';
import RegisterModal from './components/RegisterModal';
import RulesModal from './components/RulesModal';

export default function App() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournamentState, setTournamentState] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(null);

  // Admin Mode (Toggle directly to enable "+" buttons)
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState(localStorage.getItem('ihs_admin_key') || '');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);

  const fetchBracket = useCallback(async () => {
    try {
      const res = await axios.get('/api/bracket');
      setMatches(res.data.matches);
      setTeams(res.data.teams);
      setTournamentState(res.data.state);
    } catch (err) {
      console.error("Initial bracket fetch error:", err);
    }
  }, []);

  // 1. Initial Load & WebSocket Live Sync
  useEffect(() => {
    fetchBracket();

    const socket = io();
    socket.on('bracketUpdated', (data) => {
      if (data) {
        setMatches(data.matches);
        setTeams(data.teams);
        setTournamentState(data.state);
      }
    });

    return () => socket.disconnect();
  }, [fetchBracket]);

  // 2. Live Countdown Timer
  useEffect(() => {
    if (!tournamentState?.timerStartedAt || tournamentState?.isShuffled) {
      setSecondsRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const startTime = new Date(tournamentState.timerStartedAt).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, (tournamentState.countdownDurationSeconds || 300) - elapsed);

      setSecondsRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        setTimeout(() => fetchBracket(), 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tournamentState, fetchBracket]);

  // 3. Admin Shortcut: Ctrl + Shift + A or 5 clicks
  const triggerAdminPrompt = () => {
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.removeItem('ihs_admin_key');
      alert("Marshal Mode Deactivated.");
      return;
    }

    const key = prompt("Enter Marshal Secret Key to enable on-card scoring (+):");
    if (key === "IHS_ADMIN_2025") {
      setIsAdmin(true);
      setAdminKey(key);
      localStorage.setItem('ihs_admin_key', key);
      alert("Marshal Mode Activated! You can now click '+' directly on the active match card.");
    } else if (key !== null) {
      alert("Invalid Passkey.");
    }
  };

  useEffect(() => {
    if (adminKey === "IHS_ADMIN_2025") setIsAdmin(true);

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        triggerAdminPrompt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminKey, isAdmin]);

  const handleSecretClick = () => {
    setSecretClicks(prev => {
      if (prev + 1 >= 5) {
        triggerAdminPrompt();
        return 0;
      }
      return prev + 1;
    });
  };

  // Direct In-Card Score Modifier Handler
  const handleScoreChange = async (matchCode, newScoreA, newScoreB) => {
    try {
      await axios.put(`/api/admin/update-score/${matchCode}`, 
        { scoreA: newScoreA, scoreB: newScoreB },
        { headers: { 'x-admin-key': adminKey || "IHS_ADMIN_2025" } }
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update score.");
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleSecretClick}>
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  IHS Tournament
                </h1>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                  <Radio size={10} /> Live Sync
                </span>
              </div>
              <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">
                Official Double Elimination Bracket
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Marshal Status Badge */}
            {isAdmin && (
              <button
                onClick={triggerAdminPrompt}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-3 py-1.5 rounded-xl hover:bg-amber-900/50 transition"
              >
                <Unlock size={13} /> Marshal Mode Active
              </button>
            )}

            <button
              onClick={() => setIsRulesOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs uppercase font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition"
            >
              <BookOpen size={15} className="text-yellow-400" /> Rules & Prize
            </button>

            <button
              onClick={() => setIsRegisterOpen(true)}
              disabled={teams.length >= 8}
              className={`flex items-center gap-2 text-xs uppercase font-extrabold px-4 py-2 rounded-xl transition shadow-md ${
                teams.length >= 8 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <PlusCircle size={16} /> {teams.length >= 8 ? 'Roster Full (8/8)' : `Register Team (${teams.length}/8)`}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {/* 5-Minute Countdown Banner */}
        {secondsRemaining !== null && secondsRemaining > 0 && !tournamentState?.isShuffled && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-yellow-950/80 via-slate-900 to-cyan-950/80 border border-yellow-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl border border-yellow-500/40">
                <Timer size={26} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-yellow-400 block">
                  All 8 Teams Registered!
                </span>
                <h3 className="text-sm font-bold text-white">
                  Bracket matchups will randomly shuffle when the timer expires.
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-5 py-2 rounded-xl border border-yellow-500/40">
              <Shuffle className="text-cyan-400 w-4 h-4 animate-spin" />
              <span className="font-mono text-xl font-black text-yellow-400 tracking-widest">
                {formatTimer(secondsRemaining)}
              </span>
            </div>
          </div>
        )}

        {/* Post-Shuffle Confirmation */}
        {tournamentState?.isShuffled && (
          <div className="mb-6 px-4 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300">
            <span className="flex items-center gap-2 font-semibold">
              <Shuffle size={14} className="text-cyan-400" /> Matchups have been randomly generated and locked in!
            </span>
            <span className="text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
              Official Seeds Active
            </span>
          </div>
        )}

        {/* Interactive Rules Banner */}
        <div 
          onClick={() => setIsRulesOpen(true)}
          className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-yellow-950/40 border border-cyan-500/30 hover:border-cyan-400/60 transition cursor-pointer shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 group-hover:scale-105 transition">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded border border-yellow-400/30">
                  Prize Pool ₱3,300
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Fearless Draft • Best of 3 (BO5 Finals)
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Official Tournament Guidelines & Regulations <span className="text-cyan-400 text-xs group-hover:underline">Click to view full rulebook →</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-slate-900/80 px-3.5 py-1.5 rounded-lg border border-slate-700">
            <BookOpen size={14} /> View Rules
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <Shield className="text-cyan-400 w-8 h-8" />
            <div>
              <p className="text-xs text-slate-400">Registered Teams</p>
              <p className="text-lg font-bold text-white">{teams.length} / 8 Teams</p>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <Swords className="text-yellow-400 w-8 h-8" />
            <div>
              <p className="text-xs text-slate-400">Tournament Format</p>
              <p className="text-lg font-bold text-white">Double Elimination (BO3 • BO5 Finals)</p>
            </div>
          </div>
        </div>

        {/* Bracket Viewer with Direct In-Card Scoring */}
        <Bracket 
          matches={matches} 
          isAdmin={isAdmin}
          onScoreChange={handleScoreChange}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-6 text-center text-xs text-slate-600">
        <p>© 2025 IHS Tournament. All rights reserved.</p>
        <span 
          onClick={triggerAdminPrompt} 
          className="inline-block w-2 h-2 rounded-full bg-slate-800 hover:bg-cyan-500 cursor-pointer mt-2" 
          title="Toggle Marshal Mode"
        />
      </footer>

      {/* Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onRegistered={fetchBracket} />
    </div>
  );
}