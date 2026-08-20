import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Swords, Shield, PlusCircle, BookOpen, Sparkles } from 'lucide-react';
import Bracket from './components/Bracket';
import RegisterModal from './components/RegisterModal';
import AdminModal from './components/AdminModal';
import RulesModal from './components/RulesModal';

export default function App() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);

  const fetchBracket = async () => {
    try {
      const res = await axios.get('/api/bracket');
      setMatches(res.data.matches);
      setTeams(res.data.teams);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBracket();
  }, []);

  // Hidden Shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hidden 5 clicks on Logo
  const handleSecretClick = () => {
    setSecretClicks(prev => {
      if (prev + 1 >= 5) {
        setIsAdminOpen(true);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo (Removed 'MLBB Championship') */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleSecretClick}>
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                IHS Tournament
              </h1>
              <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">
                Official Double Elimination Bracket
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs uppercase font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition"
            >
              <BookOpen size={15} className="text-yellow-400" /> Rules & Prize
            </button>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs uppercase font-extrabold px-4 py-2 rounded-xl transition shadow-md shadow-cyan-500/20"
            >
              <PlusCircle size={16} /> Register Team ({teams.length}/8 Teams)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {/* Interactive Clickable Rules & Prize Banner */}
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

        {/* 2 Clean Stat Cards */}
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

        {/* Brackets */}
        {matches.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 border border-slate-800 rounded-2xl">
            <Swords className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">Bracket not generated yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Teams are currently registering. The bracket will go live once generated by the tournament marshal.
            </p>
          </div>
        ) : (
          <Bracket matches={matches} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-6 text-center text-xs text-slate-600">
        <p>© 2025 IHS Tournament. All rights reserved.</p>
        <span 
          onClick={() => setIsAdminOpen(true)} 
          className="inline-block w-2 h-2 rounded-full bg-slate-800 hover:bg-cyan-500 cursor-pointer mt-2" 
          title="Hidden Admin Console"
        />
      </footer>

      {/* Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onRegistered={fetchBracket} />
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} matches={matches} onUpdate={fetchBracket} />
    </div>
  );
}