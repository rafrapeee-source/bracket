import React from 'react';
import MatchCard from './MatchCard';

export default function Bracket({ matches }) {
  const getMatches = (bracketName, roundNum) => matches.filter(m => m.bracket === bracketName && m.round === roundNum);
  const grandFinalMatch = matches.find(m => m.bracket === 'GRAND_FINALS');

  return (
    <div className="space-y-12 overflow-x-auto pb-6">
      {/* Upper Bracket */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-4 w-1 bg-cyan-500 rounded-full" />
          <h2 className="text-lg font-bold tracking-wider text-cyan-400 uppercase">Upper Bracket</h2>
        </div>

        <div className="flex flex-row gap-8 min-w-max">
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase">Quarter Finals</p>
            {getMatches('UPPER', 1).map(match => <MatchCard key={match.matchCode} match={match} />)}
          </div>
          <div className="space-y-16 pt-8">
            <p className="text-xs font-semibold text-slate-400 uppercase">Semi Finals</p>
            {getMatches('UPPER', 2).map(match => <MatchCard key={match.matchCode} match={match} />)}
          </div>
          <div className="space-y-4 pt-24">
            <p className="text-xs font-semibold text-slate-400 uppercase">Upper Finals</p>
            {getMatches('UPPER', 3).map(match => <MatchCard key={match.matchCode} match={match} />)}
          </div>
        </div>
      </div>

      {/* Lower Bracket */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-4 w-1 bg-red-500 rounded-full" />
          <h2 className="text-lg font-bold tracking-wider text-red-400 uppercase">Lower Bracket (Elimination)</h2>
        </div>

        <div className="flex flex-row gap-8 min-w-max">
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase">LB Round 1</p>
            {getMatches('LOWER', 1).map(match => <MatchCard key={match.matchCode} match={match} />)}
          </div>
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase">LB Quarter Finals</p>
            {getMatches('LOWER', 2).map(match => <MatchCard key={match.matchCode} match={match} />)}
          </div>
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase">LB Semi Finals</p>
            {getMatches('LOWER', 3).map(match => <MatchCard key={match.matchCode} match={match} />)}
          </div>
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase">LB Finals</p>
            {getMatches('LOWER', 4).map(match => <MatchCard key={match.matchCode} match={match} />)}
          </div>
        </div>
      </div>

      {/* Grand Finals */}
      {grandFinalMatch && (
        <div className="pt-6 border-t border-slate-800 flex flex-col items-center">
          <p className="text-lg font-extrabold uppercase tracking-widest text-yellow-400 mb-4">🏆 Grand Championship 🏆</p>
          <MatchCard match={grandFinalMatch} />
        </div>
      )}
    </div>
  );
}