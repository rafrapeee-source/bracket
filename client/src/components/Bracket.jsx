import React from 'react';
import MatchCard from './MatchCard';
import { AlertCircle } from 'lucide-react';

const MATCH_ORDER = [
  'UB-R1-M1',
  'UB-R1-M2',
  'UB-R1-M3',
  'UB-R1-M4',
  'LB-R1-M1',
  'LB-R1-M2',
  'UB-R2-M1',
  'UB-R2-M2',
  'LB-R2-M1',
  'LB-R2-M2',
  'LB-R3-M1',
  'UB-FINALS',
  'LB-FINALS',
  'GRAND-FINALS',
  'GF-RESET'
];

export default function Bracket({ matches, isAdmin, onScoreChange, onSelectTeam }) {
  const getMatches = (bracketName, roundNum) => matches.filter(m => m.bracket === bracketName && m.round === roundNum);

  const currentActiveMatchCode = MATCH_ORDER.find(code => {
    const match = matches.find(m => m.matchCode === code);
    return match && match.status !== 'COMPLETED' && match.teamA && match.teamB;
  });

  const grandFinalMatch = matches.find(m => m.matchCode === 'GRAND-FINALS');
  const gfResetMatch = matches.find(m => m.matchCode === 'GF-RESET');
  const isResetActive = gfResetMatch && (gfResetMatch.teamA || gfResetMatch.teamB || gfResetMatch.status === 'ONGOING' || gfResetMatch.winner);

  return (
    <div className="space-y-16 overflow-x-auto pb-10">
      {/* UPPER BRACKET */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-4 w-1.5 bg-cyan-500 rounded-full" />
          <h2 className="text-lg font-bold tracking-wider text-cyan-400 uppercase">Upper Bracket</h2>
        </div>

        <div className="flex flex-row gap-10 min-w-max">
          {/* Quarter Finals */}
          <div className="flex flex-col w-72">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">Quarter Finals (BO3)</p>
            <div className="flex flex-col justify-between h-[560px]">
              {getMatches('UPPER', 1).map(match => (
                <MatchCard 
                  key={match.matchCode} 
                  match={match} 
                  isCurrentMatch={match.matchCode === currentActiveMatchCode}
                  isAdmin={isAdmin}
                  onScoreChange={onScoreChange}
                  onSelectTeam={onSelectTeam}
                />
              ))}
            </div>
          </div>

          {/* Semi Finals */}
          <div className="flex flex-col w-72">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">Semi Finals (BO3)</p>
            <div className="flex flex-col justify-around h-[560px]">
              {getMatches('UPPER', 2).map(match => (
                <MatchCard 
                  key={match.matchCode} 
                  match={match} 
                  isCurrentMatch={match.matchCode === currentActiveMatchCode}
                  isAdmin={isAdmin}
                  onScoreChange={onScoreChange}
                  onSelectTeam={onSelectTeam}
                />
              ))}
            </div>
          </div>

          {/* Upper Finals */}
          <div className="flex flex-col w-72">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">Upper Finals (BO3)</p>
            <div className="flex flex-col justify-center h-[560px]">
              {getMatches('UPPER', 3).map(match => (
                <MatchCard 
                  key={match.matchCode} 
                  match={match} 
                  isCurrentMatch={match.matchCode === currentActiveMatchCode}
                  isAdmin={isAdmin}
                  onScoreChange={onScoreChange}
                  onSelectTeam={onSelectTeam}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LOWER BRACKET */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-4 w-1.5 bg-red-500 rounded-full" />
          <h2 className="text-lg font-bold tracking-wider text-red-400 uppercase">Lower Bracket (Elimination)</h2>
        </div>

        <div className="flex flex-row gap-10 min-w-max">
          <div className="flex flex-col w-72">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">LB Round 1 (BO3)</p>
            <div className="flex flex-col justify-around h-[460px]">
              {getMatches('LOWER', 1).map(match => (
                <MatchCard 
                  key={match.matchCode} 
                  match={match} 
                  isCurrentMatch={match.matchCode === currentActiveMatchCode}
                  isAdmin={isAdmin}
                  onScoreChange={onScoreChange}
                  onSelectTeam={onSelectTeam}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col w-72">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">LB Quarter Finals (BO3)</p>
            <div className="flex flex-col justify-around h-[460px]">
              {getMatches('LOWER', 2).map(match => (
                <MatchCard 
                  key={match.matchCode} 
                  match={match} 
                  isCurrentMatch={match.matchCode === currentActiveMatchCode}
                  isAdmin={isAdmin}
                  onScoreChange={onScoreChange}
                  onSelectTeam={onSelectTeam}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col w-72">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">LB Semi Finals (BO3)</p>
            <div className="flex flex-col justify-center h-[460px]">
              {getMatches('LOWER', 3).map(match => (
                <MatchCard 
                  key={match.matchCode} 
                  match={match} 
                  isCurrentMatch={match.matchCode === currentActiveMatchCode}
                  isAdmin={isAdmin}
                  onScoreChange={onScoreChange}
                  onSelectTeam={onSelectTeam}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col w-72">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">LB Finals (BO3)</p>
            <div className="flex flex-col justify-center h-[460px]">
              {getMatches('LOWER', 4).map(match => (
                <MatchCard 
                  key={match.matchCode} 
                  match={match} 
                  isCurrentMatch={match.matchCode === currentActiveMatchCode}
                  isAdmin={isAdmin}
                  onScoreChange={onScoreChange}
                  onSelectTeam={onSelectTeam}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GRAND FINALS */}
      {grandFinalMatch && (
        <div className="pt-8 border-t border-slate-800 flex flex-col items-center">
          <p className="text-lg font-extrabold uppercase tracking-widest text-yellow-400 mb-6">
            🏆 Grand Championship (Best of 5) 🏆
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-400 mb-2 uppercase">Grand Finals Match 1</span>
              <MatchCard 
                match={grandFinalMatch} 
                isCurrentMatch={grandFinalMatch.matchCode === currentActiveMatchCode}
                isAdmin={isAdmin}
                onScoreChange={onScoreChange}
                onSelectTeam={onSelectTeam}
              />
            </div>

            {isResetActive && (
              <div className="flex flex-col items-center border border-yellow-500/40 p-3 rounded-2xl bg-yellow-500/5">
                <span className="text-xs font-bold text-yellow-400 mb-2 uppercase flex items-center gap-1">
                  <AlertCircle size={14} /> Bracket Reset Match (BO5)
                </span>
                <MatchCard 
                  match={gfResetMatch} 
                  isCurrentMatch={gfResetMatch.matchCode === currentActiveMatchCode}
                  isAdmin={isAdmin}
                  onScoreChange={onScoreChange}
                  onSelectTeam={onSelectTeam}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}