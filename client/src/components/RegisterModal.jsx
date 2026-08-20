import React, { useState } from 'react';
import axios from 'axios';
import { X, UserPlus } from 'lucide-react';

export default function RegisterModal({ isOpen, onClose, onRegistered }) {
  const [formData, setFormData] = useState({
    name: '', tag: '', expLane: '', core: '', midLane: '', goldLane: '', roam: '', sixthMan: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('/api/register-team', formData);
      setMessage('Team successfully registered!');
      setTimeout(() => {
        onRegistered();
        onClose();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="text-cyan-400" />
          <h2 className="text-xl font-bold text-white uppercase tracking-wide">Register Team Roster</h2>
        </div>

        {message && (
          <div className="mb-4 text-xs font-semibold p-2.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 font-semibold">Team Name</label>
              <input required placeholder="e.g. Apex Predators" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:border-cyan-500 outline-none"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold">Team Tag</label>
              <input required placeholder="APEX" maxLength={5} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white uppercase focus:border-cyan-500 outline-none"
                value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} />
            </div>
          </div>

          <div className="border-t border-slate-800 my-2 pt-2">
            <p className="text-xs font-bold text-cyan-400 mb-2 uppercase">Official 6-Player Lineup</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400">EXP Lane</label>
                <input required placeholder="Player Name" className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-sm text-white focus:border-cyan-500 outline-none"
                  value={formData.expLane} onChange={e => setFormData({ ...formData, expLane: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Core (Jungler)</label>
                <input required placeholder="Player Name" className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-sm text-white focus:border-cyan-500 outline-none"
                  value={formData.core} onChange={e => setFormData({ ...formData, core: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Mid Lane</label>
                <input required placeholder="Player Name" className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-sm text-white focus:border-cyan-500 outline-none"
                  value={formData.midLane} onChange={e => setFormData({ ...formData, midLane: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Gold Lane</label>
                <input required placeholder="Player Name" className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-sm text-white focus:border-cyan-500 outline-none"
                  value={formData.goldLane} onChange={e => setFormData({ ...formData, goldLane: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Roamer</label>
                <input required placeholder="Player Name" className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-sm text-white focus:border-cyan-500 outline-none"
                  value={formData.roam} onChange={e => setFormData({ ...formData, roam: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] text-yellow-400">6th Man (Sub)</label>
                <input required placeholder="Substitute Player" className="w-full bg-slate-800 border border-yellow-500/40 rounded px-2.5 py-1 text-sm text-white focus:border-yellow-400 outline-none"
                  value={formData.sixthMan} onChange={e => setFormData({ ...formData, sixthMan: e.target.value })} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded-xl transition shadow-lg shadow-cyan-500/20">
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}