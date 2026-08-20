import React from 'react';
import { Trophy, Flame, Plus, Minus } from 'lucide-react';

export default function MatchCard({ match, isCurrentMatch, isAdmin, onScoreChange }) {
  const isTeamAWinner = match.winner && match.teamA && match.winner._id === match.teamA._id;
  const isTeamBWinner = match.winner && match.teamB && match.winner._id === match.teamB._id;
  const isLive = match.status === 'ONGOING' && (match.scoreA > 0 || match.scoreB > 0);
  const maxScore = match.bestOf ? Math.ceil(match.bestOf / 2) : 2;

  const canScore = isAdmin && isCurrentMatch && match.status !== 'COMPLETED' && match.teamA && match.teamB;

  return (
    <div className={`w-72 bg-slate-900/95 border rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${
      isCurrentMatch && match.status !== 'COMPLETED'
        ? 'border-cyan-400 ring-2 ring-cyan-500/30 shadow-cyan-500/20 scale-[1.02]'
        : isLive
          ? 'border-amber-500/60'
          : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Header */}
      <div className={`px-3 py-1.5 flex justify-between items-center border-b text-xs font-semibold ${
        isCurrentMatch && match.status !== 'COMPLETED'
          ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
          : 'bg-slate-950/90 border-slate-800 text-slate-400'
      }`}>
        <span className="font-mono flex items-center gap-1.5">
          {match.matchCode}
          {isCurrentMatch && match.status !== 'COMPLETED' && (
            <span className="text-[9px] bg-cyan-500 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase tracking-wider animate-pulse">
              NOW PLAYING
            </span>
          )}
        </span>
        <div className="flex items-center gap-1.5">
          {isLive && !isCurrentMatch && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
              <Flame size={10} /> Live
            </span>
          )}
          <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono">
            BO{match.bestOf || 3}
          </span>
        </div>
      </div>

      {/* Team Rows */}
      <div className="p-2.5 space-y-2">
        {/* Team A */}
        <div className={`flex justify-between items-center px-2.5 py-1.5 rounded-lg ${
          isTeamAWinner 
            ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold' 
            : match.scoreA > match.scoreB 
              ? 'bg-slate-800/80 text-white font-semibold' 
              : 'bg-slate-800/40 text-slate-300'
        }`}>
          <span className="truncate max-w-[120px] text-xs">
            {match.teamA?.name || <span className="text-slate-500 italic">TBD</span>}
          </span>

          <div className="flex items-center gap-1.5">
            <span className={`font-mono text-sm px-2 py-0.5 rounded ${
              match.scoreA > 0 ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30' : 'bg-slate-950 text-slate-400'
            }`}>
              {match.scoreA}
            </span>

            {/* Direct Score Buttons for Team A */}
            {canScore && (
              <div className="flex items-center gap-1 pl-1">
                {match.scoreA > 0 && (
                  <button
                    onClick={() => onScoreChange(match.matchCode, match.scoreA - 1, match.scoreB)}
                    className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-xs transition"
                    title="Deduct point"
                  >
                    <Minus size={10} />
                  </button>
                )}
                {match.scoreA < maxScore && (
                  <button
                    onClick={() => onScoreChange(match.matchCode, match.scoreA + 1, match.scoreB)}
                    className="w-6 h-6 flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition"
                    title="Add point"
                  >
                    <Plus size={12} strokeWidth={3} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Team B */}
        <div className={`flex justify-between items-center px-2.5 py-1.5 rounded-lg ${
          isTeamBWinner 
            ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold' 
            : match.scoreB > match.scoreA 
              ? 'bg-slate-800/80 text-white font-semibold' 
              : 'bg-slate-800/40 text-slate-300'
        }`}>
          <span className="truncate max-w-[120px] text-xs">
            {match.teamB?.name || <span className="text-slate-500 italic">TBD</span>}
          </span>

          <div className="flex items-center gap-1.5">
            <span className={`font-mono text-sm px-2 py-0.5 rounded ${
              match.scoreB > 0 ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30' : 'bg-slate-950 text-slate-400'
            }`}>
              {match.scoreB}
            </span>

            {/* Direct Score Buttons for Team B */}
            {canScore && (
              <div className="flex items-center gap-1 pl-1">
                {match.scoreB > 0 && (
                  <button
                    onClick={() => onScoreChange(match.matchCode, match.scoreA, match.scoreB - 1)}
                    className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-xs transition"
                    title="Deduct point"
                  >
                    <Minus size={10} />
                  </button>
                )}
                {match.scoreB < maxScore && (
                  <button
                    onClick={() => onScoreChange(match.matchCode, match.scoreA, match.scoreB + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition"
                    title="Add point"
                  >
                    <Plus size={12} strokeWidth={3} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completed State */}
      {match.status === 'COMPLETED' && (
        <div className="bg-cyan-500/10 text-cyan-400 text-[11px] py-1 text-center font-medium border-t border-cyan-500/20 flex items-center justify-center gap-1">
          <Trophy size={12} /> Winner: {match.winner?.tag || match.winner?.name}
        </div>
      )}
    </div>
  );
}