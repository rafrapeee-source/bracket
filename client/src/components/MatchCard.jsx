import React from 'react';
import { Trophy, Flame } from 'lucide-react';

export default function MatchCard({ match }) {
  const isTeamAWinner = match.winner && match.teamA && match.winner._id === match.teamA._id;
  const isTeamBWinner = match.winner && match.teamB && match.winner._id === match.teamB._id;
  const isLiveOngoing = match.status === 'ONGOING' && (match.scoreA > 0 || match.scoreB > 0);

  return (
    <div className={`w-64 bg-slate-900/90 border rounded-xl overflow-hidden shadow-lg transition duration-200 ${
      isLiveOngoing ? 'border-amber-500/60 shadow-amber-500/10' : 'border-slate-800 hover:border-cyan-500/50'
    }`}>
      {/* Card Header */}
      <div className="bg-slate-950/90 px-3 py-1.5 flex justify-between items-center border-b border-slate-800 text-xs font-semibold text-slate-400">
        <span className="font-mono">{match.matchCode}</span>
        <div className="flex items-center gap-1.5">
          {isLiveOngoing && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
              <Flame size={10} /> Live
            </span>
          )}
          <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono">
            BO{match.bestOf || 3}
          </span>
        </div>
      </div>

      {/* Team Rows */}
      <div className="p-2.5 space-y-1.5">
        {/* Team A */}
        <div className={`flex justify-between items-center px-2.5 py-1.5 rounded-md ${
          isTeamAWinner 
            ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 font-bold shadow-sm' 
            : match.scoreA > match.scoreB 
              ? 'bg-slate-800/80 text-white font-semibold' 
              : 'bg-slate-800/40 text-slate-300'
        }`}>
          <span className="truncate max-w-[140px] text-xs">
            {match.teamA?.name || <span className="text-slate-500 italic">TBD</span>}
          </span>
          <span className={`font-mono text-sm px-2 py-0.5 rounded ${
            match.scoreA > 0 ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30' : 'bg-slate-950 text-slate-400'
          }`}>
            {match.scoreA}
          </span>
        </div>

        {/* Team B */}
        <div className={`flex justify-between items-center px-2.5 py-1.5 rounded-md ${
          isTeamBWinner 
            ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 font-bold shadow-sm' 
            : match.scoreB > match.scoreA 
              ? 'bg-slate-800/80 text-white font-semibold' 
              : 'bg-slate-800/40 text-slate-300'
        }`}>
          <span className="truncate max-w-[140px] text-xs">
            {match.teamB?.name || <span className="text-slate-500 italic">TBD</span>}
          </span>
          <span className={`font-mono text-sm px-2 py-0.5 rounded ${
            match.scoreB > 0 ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30' : 'bg-slate-950 text-slate-400'
          }`}>
            {match.scoreB}
          </span>
        </div>
      </div>

      {/* Completed Banner */}
      {match.status === 'COMPLETED' && (
        <div className="bg-cyan-500/10 text-cyan-400 text-[11px] py-1 text-center font-medium border-t border-cyan-500/20 flex items-center justify-center gap-1">
          <Trophy size={12} /> Winner: {match.winner?.tag || match.winner?.name}
        </div>
      )}
    </div>
  );
}