import React, { useState } from 'react';
import axios from 'axios';
import { X, Settings, RefreshCcw } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, matches, onUpdate }) {
  const [adminKey, setAdminKey] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [selectedMatchCode, setSelectedMatchCode] = useState('');
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const currentMatch = matches.find(m => m.matchCode === selectedMatchCode);
  const maxScore = currentMatch?.bestOf ? Math.ceil(currentMatch.bestOf / 2) : 2;

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminKey === "IHS_ADMIN_2025") {
      setAuthorized(true);
      setStatusMsg('');
    } else {
      setStatusMsg('Invalid Secret Admin Key');
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/update-score/${selectedMatchCode}`, 
        { scoreA: Number(scoreA), scoreB: Number(scoreB) },
        { headers: { 'x-admin-key': adminKey } }
      );
      setStatusMsg(`Match ${selectedMatchCode} updated successfully!`);
      onUpdate();
    } catch (err) {
      setStatusMsg(err.response?.data?.error || 'Failed to update score');
    }
  };

  const handleInitBracket = async () => {
    if (!window.confirm("Initialize or reset the entire bracket with registered teams?")) return;
    try {
      await axios.post('/api/admin/init-bracket', {}, { headers: { 'x-admin-key': adminKey } });
      setStatusMsg('Double Elimination Bracket initialized!');
      onUpdate();
    } catch (err) {
      setStatusMsg(err.response?.data?.error || 'Failed to initialize bracket');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-cyan-500/50 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4 text-cyan-400">
          <Settings size={22} />
          <h2 className="text-xl font-bold uppercase tracking-wider">Tournament Admin Panel</h2>
        </div>

        {statusMsg && (
          <div className="mb-4 text-xs font-semibold p-2.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/20">
            {statusMsg}
          </div>
        )}

        {!authorized ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400">Enter Admin Secret Passphrase</label>
              <input 
                type="password" 
                placeholder="Passcode" 
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-cyan-400 mt-1"
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded">
              Authenticate
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <RefreshCcw size={16} className="text-yellow-400" /> Bracket Setup
              </h3>
              <button 
                onClick={handleInitBracket} 
                className="w-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 hover:bg-yellow-500/30 text-xs font-bold py-2 rounded transition"
              >
                Generate / Reset Double Elimination Bracket
              </button>
            </div>

            <form onSubmit={handleScoreSubmit} className="space-y-3">
              <h3 className="text-sm font-bold text-white">
                Update Match Score {currentMatch && `(BO${currentMatch.bestOf} - First to ${maxScore})`}
              </h3>
              <div>
                <label className="text-xs text-slate-400">Select Active Match</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none mt-1"
                  value={selectedMatchCode}
                  onChange={e => {
                    setSelectedMatchCode(e.target.value);
                    const selected = matches.find(m => m.matchCode === e.target.value);
                    if (selected) {
                      setScoreA(selected.scoreA || 0);
                      setScoreB(selected.scoreB || 0);
                    }
                  }}
                  required
                >
                  <option value="">-- Select Match --</option>
                  {matches.map(m => (
                    <option key={m.matchCode} value={m.matchCode}>
                      {m.matchCode} (BO{m.bestOf}): {m.teamA?.name || 'TBD'} vs {m.teamB?.name || 'TBD'} [{m.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">
                    {currentMatch?.teamA?.name || 'Team A'} Score (Max {maxScore})
                  </label>
                  <input 
                    type="number" min="0" max={maxScore} 
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-cyan-400 mt-1 font-mono"
                    value={scoreA}
                    onChange={e => setScoreA(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">
                    {currentMatch?.teamB?.name || 'Team B'} Score (Max {maxScore})
                  </label>
                  <input 
                    type="number" min="0" max={maxScore} 
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-cyan-400 mt-1 font-mono"
                    value={scoreB}
                    onChange={e => setScoreB(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded mt-2">
                Submit Score & Auto Advance
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}