import React from 'react';
import { X, Trophy, Coins, ShieldCheck, Gamepad2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    /* Outer Backdrop with single screen-edge scrollbar */
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto rules-scrollbar">
      {/* Modal Container: Natural height without nested inner scroll */}
      <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">
              Official Tournament Rulebook
            </h2>
            <p className="text-xs text-cyan-400 font-medium tracking-wide">
              IHS Tournament Guidelines, Structure & Code of Conduct
            </p>
          </div>
        </div>

        {/* Modal Content: Flows naturally (no nested scrollbar) */}
        <div className="mt-5 space-y-6 text-slate-300 text-sm">
          
          {/* Prize & Buy-in Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 p-3.5 rounded-xl flex items-center gap-3">
              <Trophy className="text-yellow-400 w-8 h-8 flex-shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider block">Grand Prize Pool</span>
                <span className="text-xl font-black text-white tracking-tight">₱3,300</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 p-3.5 rounded-xl flex items-center gap-3">
              <Coins className="text-cyan-400 w-8 h-8 flex-shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Registration Fee</span>
                <span className="text-xl font-black text-white tracking-tight">₱600 <span className="text-xs font-normal text-slate-400">/ Team</span></span>
              </div>
            </div>
          </div>

          {/* Section 1: Eligibility & Roster */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <ShieldCheck size={16} /> 1. Eligibility & Roster Requirements
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <span><strong>Employee Verification:</strong> Tournament participation is strictly exclusive to <strong>active IHS employees</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <span><strong>Team Composition:</strong> Each squad consists of 5 designated starters and up to 1 registered substitute (5–6 players total).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <span><strong>In-Game Names (IGNs):</strong> Declared player IGNs submitted during registration must strictly match in-game accounts. Unregistered smurf/proxy accounts will result in forfeiture.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <span><strong>Substitution Policy:</strong> Any roster substitution must be formally declared to the tournament marshal before the match draft commences.</span>
              </li>
            </ul>
          </div>

          {/* Section 2: Match Format & Draft System */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-2">
              <Gamepad2 size={16} /> 2. Tournament Format & Draft Regulations
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <span><strong>Fearless Draft Mode:</strong> Active across all series. Once a team picks a hero in any game of a series, that specific hero cannot be selected again by the same team for the remainder of that match.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <span><strong>Elimination Bracket:</strong> Double Elimination structure. All Upper and Lower Bracket rounds are <strong>Best of 3 (BO3)</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <span><strong>Grand Finals & Bracket Reset:</strong> The Grand Finals is <strong>Best of 5 (BO5)</strong>. The Upper Bracket Champion holds a <em>Twice-to-Beat</em> advantage (the Lower Bracket Finalist must defeat the Upper Bracket Champion in two consecutive BO5 series to win the title).</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Match Protocol & Punctuality */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Clock size={16} /> 3. Schedule, Diagnostics & Punctuality
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <span><strong>Grace Period:</strong> A maximum <strong>15-minute grace period</strong> from the scheduled match time is permitted. Failure to field 5 players after 15 minutes incurs an automatic default loss.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <span><strong>Pre-Match Connection Check:</strong> Teams are allotted a <strong>1-minute network check</strong> inside the custom lobby prior to initiating the draft phase.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Conduct & In-Game Etiquette */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
              <AlertTriangle size={16} /> 4. Player Conduct & Fair Play
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span><strong>Anti-Harassment Policy:</strong> Toxic behavior, verbal insults, offensive remarks, and derogatory conduct in all-chat or voice channels are strictly prohibited.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>In-Game Taunting:</strong> Recall spamming (TP) and in-game emotes are <strong>permitted</strong> as legitimate psychological gameplay elements.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer Button */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition duration-200 shadow-lg shadow-cyan-500/20"
          >
            I Understand the Rules
          </button>
        </div>
      </div>
    </div>
  );
}