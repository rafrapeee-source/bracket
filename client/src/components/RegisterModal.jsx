import React, { useState } from 'react';
import axios from 'axios';
import { X, UserPlus } from 'lucide-react';
import { ExpLaneIcon, CoreIcon, MidLaneIcon, GoldLaneIcon, RoamIcon, SixthManIcon } from './RoleIcons';

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
      setMessage('Team registered successfully!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto rules-scrollbar">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative my-8">
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
              <input required placeholder="e.g. Blacklist Echo" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:border-cyan-500 outline-none mt-0.5"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold">Tag</label>
              <input required placeholder="ECHO" maxLength={5} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white uppercase focus:border-cyan-500 outline-none mt-0.5"
                value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} />
            </div>
          </div>

          <div className="border-t border-slate-800 my-2 pt-2">
            <p className="text-xs font-bold text-cyan-400 mb-2 uppercase">Official Role Positions</p>
            
            <div className="grid grid-cols-2 gap-2.5">
              {/* EXP */}
              <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <ExpLaneIcon className="w-7 h-7 flex-shrink-0" />
                <div className="w-full">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">EXP Lane</label>
                  <input required placeholder="IGN" className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:border-cyan-500 outline-none mt-0.5"
                    value={formData.expLane} onChange={e => setFormData({ ...formData, expLane: e.target.value })} />
                </div>
              </div>

              {/* CORE */}
              <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <CoreIcon className="w-7 h-7 flex-shrink-0" />
                <div className="w-full">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Core (Jungle)</label>
                  <input required placeholder="IGN" className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:border-cyan-500 outline-none mt-0.5"
                    value={formData.core} onChange={e => setFormData({ ...formData, core: e.target.value })} />
                </div>
              </div>

              {/* MID */}
              <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <MidLaneIcon className="w-7 h-7 flex-shrink-0" />
                <div className="w-full">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Mid Lane</label>
                  <input required placeholder="IGN" className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:border-cyan-500 outline-none mt-0.5"
                    value={formData.midLane} onChange={e => setFormData({ ...formData, midLane: e.target.value })} />
                </div>
              </div>

              {/* GOLD */}
              <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <GoldLaneIcon className="w-7 h-7 flex-shrink-0" />
                <div className="w-full">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Gold Lane</label>
                  <input required placeholder="IGN" className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:border-cyan-500 outline-none mt-0.5"
                    value={formData.goldLane} onChange={e => setFormData({ ...formData, goldLane: e.target.value })} />
                </div>
              </div>

              {/* ROAM */}
              <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <RoamIcon className="w-7 h-7 flex-shrink-0" />
                <div className="w-full">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Roamer</label>
                  <input required placeholder="IGN" className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:border-cyan-500 outline-none mt-0.5"
                    value={formData.roam} onChange={e => setFormData({ ...formData, roam: e.target.value })} />
                </div>
              </div>

              {/* 6TH MAN */}
              <div className="bg-slate-800/50 p-2 rounded-xl border border-orange-500/30 flex items-center gap-2">
                <SixthManIcon className="w-7 h-7 flex-shrink-0" />
                <div className="w-full">
                  <label className="text-[10px] text-orange-400 font-bold uppercase block">6th Man (Sub)</label>
                  <input required placeholder="IGN" className="w-full bg-slate-900 border border-orange-500/40 rounded px-2 py-0.5 text-xs text-white focus:border-orange-400 outline-none mt-0.5"
                    value={formData.sixthMan} onChange={e => setFormData({ ...formData, sixthMan: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20">
            {loading ? 'Registering...' : 'Complete Team Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}