import React from 'react';
import { Trophy } from 'lucide-react';

export default function MatchCard({ match }) {
  const isTeamAWinner = match.winner && match.teamA && match.winner._id === match.teamA._id;
  const isTeamBWinner = match.winner && match.teamB && match.winner._id === match.teamB._id;

  return (
    <div className="w-64 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-cyan-500/50 transition">
      <div className="bg-slate-950/80 px-3 py-1.5 flex justify-between items-center border-b border-slate-800 text-xs font-semibold text-slate-400">
        <span>{match.matchCode}</span>
        <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono">
          BO{match.bestOf || 3}
        </span>
      </div>

      <div className="p-2.5 space-y-1.5">
        <div className={`flex justify-between items-center px-2.5 py-1.5 rounded-md ${
          isTeamAWinner ? 'bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 font-bold' : 'bg-slate-800/40 text-slate-300'
        }`}>
          <span className="truncate max-w-[140px] text-xs">
            {match.teamA?.name || <span className="text-slate-500 italic">TBD</span>}
          </span>
          <span className="font-mono text-sm px-2 py-0.5 bg-slate-950 rounded">
            {match.scoreA}
          </span>
        </div>

        <div className={`flex justify-between items-center px-2.5 py-1.5 rounded-md ${
          isTeamBWinner ? 'bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 font-bold' : 'bg-slate-800/40 text-slate-300'
        }`}>
          <span className="truncate max-w-[140px] text-xs">
            {match.teamB?.name || <span className="text-slate-500 italic">TBD</span>}
          </span>
          <span className="font-mono text-sm px-2 py-0.5 bg-slate-950 rounded">
            {match.scoreB}
          </span>
        </div>
      </div>

      {match.status === 'COMPLETED' && (
        <div className="bg-cyan-500/10 text-cyan-400 text-[11px] py-1 text-center font-medium border-t border-cyan-500/20 flex items-center justify-center gap-1">
          <Trophy size={12} /> Winner: {match.winner?.tag || match.winner?.name}
        </div>
      )}
    </div>
  );
}