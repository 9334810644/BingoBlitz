import React, { useState } from 'react';
import { CalledBall } from '../types';
import { BINGO_LETTERS, BINGO_LETTER_COLORS, COLUMN_RANGES } from '../utils/bingo';
import { ChevronDown, ChevronUp, Grid } from 'lucide-react';

interface CallHistoryBoardProps {
  calledNumbersSet: Set<number>;
  calledHistory: CalledBall[];
}

export const CallHistoryBoard: React.FC<CallHistoryBoardProps> = ({
  calledNumbersSet,
  calledHistory,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-200/50 text-slate-800 max-w-lg mx-auto w-full">
      {/* Board Header */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Called Numbers Matrix (1–25)
          </h3>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200 font-extrabold">
            {calledNumbersSet.size} / 25
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Matrix Content */}
      {isExpanded && (
        <div className="mt-4 space-y-2.5">
          {BINGO_LETTERS.map((letter) => {
            const range = COLUMN_RANGES[letter];
            const colors = BINGO_LETTER_COLORS[letter];
            const numCount = range.max - range.min + 1;
            const rowNumbers = Array.from({ length: numCount }, (_, i) => range.min + i);

            return (
              <div key={letter} className="flex items-center gap-2 sm:gap-3">
                {/* Letter badge */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black text-sm text-white flex items-center justify-center bg-gradient-to-br ${colors.highlight} shadow-sm shrink-0`}
                >
                  {letter}
                </div>

                {/* 5 Numbers in Range */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 flex-1">
                  {rowNumbers.map((num) => {
                    const isCalled = calledNumbersSet.has(num);
                    const isLatest = calledHistory[calledHistory.length - 1]?.number === num;

                    return (
                      <div
                        key={num}
                        className={`h-8 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center transition-all ${
                          isLatest
                            ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300 scale-105 z-10 shadow-md animate-pulse'
                            : isCalled
                            ? `${colors.bg} text-white shadow-sm border border-white/20`
                            : 'bg-slate-50 text-slate-400 border border-slate-200/60'
                        }`}
                        title={isCalled ? `Called: ${letter}-${num}` : `Uncalled: ${letter}-${num}`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
