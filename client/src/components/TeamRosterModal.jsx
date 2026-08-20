import React from 'react';
import { X, Users } from 'lucide-react';
import { ExpLaneIcon, CoreIcon, MidLaneIcon, GoldLaneIcon, RoamIcon, SixthManIcon } from './RoleIcons';

export default function TeamRosterModal({ isOpen, onClose, selectedTeam, allTeams, onSelectTeam }) {
  if (!isOpen || !selectedTeam) return null;

  const roles = [
    { key: 'expLane', label: 'EXP Lane', Icon: ExpLaneIcon, colorBorder: 'hover:border-purple-500/40' },
    { key: 'core', label: 'Core (Jungler)', Icon: CoreIcon, colorBorder: 'hover:border-cyan-500/40' },
    { key: 'midLane', label: 'Mid Lane', Icon: MidLaneIcon, colorBorder: 'hover:border-teal-500/40' },
    { key: 'goldLane', label: 'Gold Lane', Icon: GoldLaneIcon, colorBorder: 'hover:border-yellow-500/40' },
    { key: 'roam', label: 'Roamer', Icon: RoamIcon, colorBorder: 'hover:border-emerald-500/40' },
    { key: 'sixthMan', label: '6th Man (Substitute)', Icon: SixthManIcon, colorBorder: 'hover:border-orange-500/40' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto rules-scrollbar">
      <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full"
        >
          <X size={18} />
        </button>

        {/* Team Selector Tabs */}
        {allTeams && allTeams.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 border-b border-slate-800 rules-scrollbar">
            {allTeams.map(team => (
              <button
                key={team._id}
                onClick={() => onSelectTeam(team)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedTeam._id === team._id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {team.name} [{team.tag}]
              </button>
            ))}
          </div>
        )}

        {/* Selected Team Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20 text-white font-black text-lg">
              {selectedTeam.tag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black uppercase tracking-wider text-white">
                  {selectedTeam.name}
                </h2>
                <span className="text-[10px] font-bold bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
                  Seed #{selectedTeam.seed || 1}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Official Registered 6-Man Squad
              </p>
            </div>
          </div>
        </div>

        {/* 6 Official Role Cards with Real Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
          {roles.map(role => {
            const { Icon } = role;
            const playerName = selectedTeam.players?.[role.key] || 'Unassigned';

            return (
              <div 
                key={role.key} 
                className={`bg-slate-800/40 border border-slate-800 rounded-xl p-3 flex items-center justify-between transition ${role.colorBorder}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Icon className="w-10 h-10 rounded-lg shadow-md border border-slate-700/50" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {role.label}
                    </span>
                    <span className="text-sm font-black text-white tracking-wide">
                      {playerName}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                  Starter
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
          >
            Close Roster View
          </button>
        </div>
      </div>
    </div>
  );
}