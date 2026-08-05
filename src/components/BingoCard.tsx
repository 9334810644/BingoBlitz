import React from 'react';
import { Shuffle, Check, Sparkles } from 'lucide-react';
import { Cell, WinningLineDetail } from '../types';
import { BINGO_LETTERS, BINGO_LETTER_COLORS } from '../utils/bingo';
import { motion } from 'motion/react';

interface BingoCardProps {
  grid: Cell[][];
  onToggleCell: (row: number, col: number) => void;
  onNewCard: () => void;
  isGameActive: boolean;
  winningCellIds: Set<string>;
  winningLines?: string[];
  winningLineDetails?: WinningLineDetail[];
}

export const BingoCard: React.FC<BingoCardProps> = ({
  grid,
  onToggleCell,
  onNewCard,
  isGameActive,
  winningCellIds,
  winningLines = [],
  winningLineDetails = [],
}) => {
  const linesCount = winningLines.length;
  const isWon = linesCount >= 5;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl shadow-slate-200/80 p-3.5 sm:p-6 border border-slate-200/80 flex flex-col justify-between max-w-lg mx-auto w-full transition-all">
      {/* Card Top Header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
              isWon ? 'bg-amber-500 ring-4 ring-amber-200 animate-pulse' : 'bg-indigo-600 ring-2 ring-indigo-200'
            }`}
          />
          <div>
            <h2 className="font-extrabold text-slate-900 text-base sm:text-xl tracking-tight leading-none">
              BingoBlitz Card
            </h2>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">
              {linesCount === 0
                ? 'Complete 5 lines to spell B-I-N-G-O'
                : `${linesCount} of 5 lines cut (${BINGO_LETTERS.slice(0, linesCount).join('-') || ''})`}
            </p>
          </div>
        </div>

        <button
          onClick={onNewCard}
          disabled={isGameActive}
          className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md active:scale-95 shrink-0 ${
            isGameActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          title="Generate a new random card layout"
        >
          <Shuffle className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Card</span>
        </button>
      </div>

      {/* 5x5 Bingo Grid Container */}
      <div className="bg-slate-100/80 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-inner relative">
        {/* Column Headers B-I-N-G-O with Strikethrough Cut Effect */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mb-2 sm:mb-3 text-center">
          {BINGO_LETTERS.map((letter, idx) => {
            const colors = BINGO_LETTER_COLORS[letter];
            // idx 0 -> line 1 cuts 'B', idx 1 -> line 2 cuts 'I', etc.
            const isCut = linesCount >= idx + 1;

            return (
              <div
                key={letter}
                className={`relative h-10 sm:h-16 flex items-center justify-center rounded-lg sm:rounded-xl font-black text-lg sm:text-3xl text-white shadow-sm border border-white/30 select-none overflow-hidden transition-all duration-300 ${
                  isCut
                    ? 'bg-gradient-to-br from-rose-600 via-red-600 to-amber-500 ring-2 ring-amber-400 scale-[1.02]'
                    : `bg-gradient-to-br ${colors.highlight}`
                }`}
              >
                <span className={`relative z-10 transition-all ${isCut ? 'line-through decoration-amber-300 decoration-[3px] sm:decoration-[5px] opacity-90' : ''}`}>
                  {letter}
                </span>

                {/* Animated Bold Strikethrough Slash across Column Header */}
                {isCut && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                    className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-1 sm:h-2 bg-amber-300 rounded-full shadow-lg -rotate-12 pointer-events-none z-20"
                  />
                )}

                {/* Cut Checkmark Indicator */}
                {isCut && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 z-20 bg-amber-300 text-slate-950 rounded-full p-0.5 shadow-xs"
                  >
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[4]" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* 5x5 Grid Cells */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 relative">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isWinning = winningCellIds.has(cell.id);
              const letterColors = BINGO_LETTER_COLORS[cell.letter];

              return (
                <motion.button
                  key={cell.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onToggleCell(rowIndex, colIndex)}
                  className={`relative aspect-square rounded-lg sm:rounded-xl font-extrabold text-base sm:text-2xl flex flex-col items-center justify-center transition-all select-none overflow-hidden cursor-pointer ${
                    isWinning
                      ? 'ring-2 sm:ring-4 ring-amber-400 ring-offset-1 sm:ring-offset-2 ring-offset-slate-100 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white font-black shadow-lg z-10'
                      : cell.isMarked
                      ? 'bg-white text-slate-900 border-2 border-indigo-500 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-xs hover:border-slate-300'
                  }`}
                >
                  <span className={`relative z-10 transition-colors ${cell.isMarked && !isWinning ? 'text-indigo-950 font-black' : ''}`}>
                    {cell.number}
                  </span>

                  {/* Stamp / Dauber Overlay when Marked */}
                  {cell.isMarked && !isWinning && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className={`w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${letterColors.highlight} opacity-85 flex items-center justify-center shadow-md border-2 border-white text-white`}>
                        <Check className="w-4 h-4 sm:w-7 sm:h-7 stroke-[3.5]" />
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })
          )}

          {/* SVG Animated Strike-Through Line Overlays across Completed Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            <defs>
              <linearGradient id="strikeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {winningLineDetails.map((line, idx) => {
              let x1 = '0%', y1 = '0%', x2 = '0%', y2 = '0%';
              if (line.type === 'row') {
                const cy = `${(line.index + 0.5) * 20}%`;
                x1 = '2%'; x2 = '98%'; y1 = cy; y2 = cy;
              } else if (line.type === 'col') {
                const cx = `${(line.index + 0.5) * 20}%`;
                x1 = cx; x2 = cx; y1 = '2%'; y2 = '98%';
              } else if (line.type === 'diag-main') {
                x1 = '3%'; y1 = '3%'; x2 = '97%'; y2 = '97%';
              } else if (line.type === 'diag-anti') {
                x1 = '97%'; y1 = '3%'; x2 = '3%'; y2 = '97%';
              }

              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#strikeGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  className="opacity-90 animate-pulse"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Footer Tip */}
      <div className="mt-3 sm:mt-4 text-center text-[11px] sm:text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span>Tap numbers to mark or unmark them on your card</span>
      </div>
    </div>
  );
};
