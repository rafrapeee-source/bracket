import React, { useState } from 'react';
import MatchCard from './MatchCard';
import { AlertCircle, MoveRight } from 'lucide-react';

export default function Bracket({ matches, isAdmin, onScoreChange, onSelectTeam }) {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'UPPER', 'LOWER', 'FINALS'

  const getMatches = (bracketName, roundNum) => matches.filter(m => m.bracket === bracketName && m.round === roundNum);

  const grandFinalMatch = matches.find(m => m.matchCode === 'GRAND-FINALS');
  const gfResetMatch = matches.find(m => m.matchCode === 'GF-RESET');
  const isResetActive = gfResetMatch && (gfResetMatch.teamA || gfResetMatch.teamB || gfResetMatch.status === 'ONGOING' || gfResetMatch.winner);

  return (
    <div className="space-y-8">
      {/* Mobile Bracket Filter Tabs */}
      <div className="flex sm:hidden justify-between items-center bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-bold gap-1">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-1.5 rounded-lg transition ${activeTab === 'ALL' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('UPPER')}
          className={`flex-1 py-1.5 rounded-lg transition ${activeTab === 'UPPER' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
        >
          Upper
        </button>
        <button
          onClick={() => setActiveTab('LOWER')}
          className={`flex-1 py-1.5 rounded-lg transition ${activeTab === 'LOWER' ? 'bg-red-500 text-slate-950 font-black' : 'text-slate-400'}`}
        >
          Lower
        </button>
        <button
          onClick={() => setActiveTab('FINALS')}
          className={`flex-1 py-1.5 rounded-lg transition ${activeTab === 'FINALS' ? 'bg-yellow-500 text-slate-950 font-black' : 'text-slate-400'}`}
        >
          Finals
        </button>
      </div>

      {/* Swipe Helper Hint on Mobile */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pb-1">
        <span>Swipe horizontally to view full bracket</span>
        <MoveRight size={13} className="text-cyan-400 animate-pulse" />
      </div>

      {/* UPPER BRACKET */}
      {(activeTab === 'ALL' || activeTab === 'UPPER') && (
        <div className="overflow-x-auto rules-scrollbar pb-6 smooth-scroll">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-4 w-1.5 bg-cyan-500 rounded-full" />
            <h2 className="text-base sm:text-lg font-bold tracking-wider text-cyan-400 uppercase">Upper Bracket</h2>
          </div>

          <div className="flex flex-row gap-6 sm:gap-10 min-w-max">
            {/* Quarter Finals */}
            <div className="flex flex-col w-64 sm:w-72">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">Quarter Finals (BO3)</p>
              <div className="flex flex-col justify-between h-[540px]">
                {getMatches('UPPER', 1).map(match => (
                  <MatchCard 
                    key={match.matchCode} 
                    match={match} 
                    isAdmin={isAdmin}
                    onScoreChange={onScoreChange}
                    onSelectTeam={onSelectTeam}
                  />
                ))}
              </div>
            </div>

            {/* Semi Finals */}
            <div className="flex flex-col w-64 sm:w-72">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">Semi Finals (BO3)</p>
              <div className="flex flex-col justify-around h-[540px]">
                {getMatches('UPPER', 2).map(match => (
                  <MatchCard 
                    key={match.matchCode} 
                    match={match} 
                    isAdmin={isAdmin}
                    onScoreChange={onScoreChange}
                    onSelectTeam={onSelectTeam}
                  />
                ))}
              </div>
            </div>

            {/* Upper Finals */}
            <div className="flex flex-col w-64 sm:w-72">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">Upper Finals (BO3)</p>
              <div className="flex flex-col justify-center h-[540px]">
                {getMatches('UPPER', 3).map(match => (
                  <MatchCard 
                    key={match.matchCode} 
                    match={match} 
                    isAdmin={isAdmin}
                    onScoreChange={onScoreChange}
                    onSelectTeam={onSelectTeam}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOWER BRACKET */}
      {(activeTab === 'ALL' || activeTab === 'LOWER') && (
        <div className="overflow-x-auto rules-scrollbar pb-6 smooth-scroll">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-4 w-1.5 bg-red-500 rounded-full" />
            <h2 className="text-base sm:text-lg font-bold tracking-wider text-red-400 uppercase">Lower Bracket (Elimination)</h2>
          </div>

          <div className="flex flex-row gap-6 sm:gap-10 min-w-max">
            <div className="flex flex-col w-64 sm:w-72">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">LB Round 1 (BO3)</p>
              <div className="flex flex-col justify-around h-[440px]">
                {getMatches('LOWER', 1).map(match => (
                  <MatchCard 
                    key={match.matchCode} 
                    match={match} 
                    isAdmin={isAdmin}
                    onScoreChange={onScoreChange}
                    onSelectTeam={onSelectTeam}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col w-64 sm:w-72">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">LB Quarter Finals (BO3)</p>
              <div className="flex flex-col justify-around h-[440px]">
                {getMatches('LOWER', 2).map(match => (
                  <MatchCard 
                    key={match.matchCode} 
                    match={match} 
                    isAdmin={isAdmin}
                    onScoreChange={onScoreChange}
                    onSelectTeam={onSelectTeam}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col w-64 sm:w-72">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">LB Semi Finals (BO3)</p>
              <div className="flex flex-col justify-center h-[440px]">
                {getMatches('LOWER', 3).map(match => (
                  <MatchCard 
                    key={match.matchCode} 
                    match={match} 
                    isAdmin={isAdmin}
                    onScoreChange={onScoreChange}
                    onSelectTeam={onSelectTeam}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col w-64 sm:w-72">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3 text-center">LB Finals (BO3)</p>
              <div className="flex flex-col justify-center h-[440px]">
                {getMatches('LOWER', 4).map(match => (
                  <MatchCard 
                    key={match.matchCode} 
                    match={match} 
                    isAdmin={isAdmin}
                    onScoreChange={onScoreChange}
                    onSelectTeam={onSelectTeam}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GRAND FINALS */}
      {(activeTab === 'ALL' || activeTab === 'FINALS') && grandFinalMatch && (
        <div className="pt-6 border-t border-slate-800 flex flex-col items-center">
          <p className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-yellow-400 mb-6 text-center">
            🏆 Grand Championship (Best of 5) 🏆
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-400 mb-2 uppercase">Grand Finals Match 1</span>
              <MatchCard 
                match={grandFinalMatch} 
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