import React from 'react';
import { Shuffle, Check, Sparkles, Hourglass, Target } from 'lucide-react';
import { Cell, WinningLineDetail, GameMode } from '../types';
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
  gameMode?: GameMode;
  isMyTurn?: boolean;
  currentTurnPlayerName?: string;
}

export const BingoCard: React.FC<BingoCardProps> = ({
  grid,
  onToggleCell,
  onNewCard,
  isGameActive,
  winningCellIds,
  winningLines = [],
  winningLineDetails = [],
  gameMode = 'solo',
  isMyTurn = true,
  currentTurnPlayerName,
}) => {
  const linesCount = winningLines.length;
  const isWon = linesCount >= 5;

  return (
    <div className="glass-panel rounded-3xl shadow-2xl shadow-slate-300/60 p-4 sm:p-7 border border-white/80 flex flex-col justify-between max-w-lg mx-auto w-full transition-all relative z-10">
      {/* Card Top Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full transition-all ${
              isWon ? 'bg-amber-500 ring-4 ring-amber-300 animate-pulse shadow-md shadow-amber-300' : 'bg-indigo-600 ring-4 ring-indigo-100 shadow-md shadow-indigo-200'
            }`}
          />
          <div>
            <h2 className="font-black text-slate-900 text-lg sm:text-2xl tracking-tight leading-none font-display">
              BingoBlitz Card
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1">
              {linesCount === 0
                ? 'Complete 5 lines to spell B-I-N-G-O'
                : `${linesCount} of 5 lines cut (${BINGO_LETTERS.slice(0, linesCount).join('-') || ''})`}
            </p>
          </div>
        </div>

        <button
          onClick={onNewCard}
          disabled={isGameActive}
          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white hover:from-slate-800 hover:to-indigo-900 transition-all shadow-md active:scale-95 shrink-0 border border-slate-700/50 ${
            isGameActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          title="Generate a new random card layout"
        >
          <Shuffle className="w-4 h-4 stroke-[2.5]" />
          <span>New Card</span>
        </button>
      </div>

      {/* Multiplayer Turn Status Banner */}
      {gameMode === 'multiplayer' && (
        <div
          className={`mb-4 py-2.5 px-4 rounded-2xl border text-xs sm:text-sm font-extrabold flex items-center justify-between shadow-xs transition-all ${
            isMyTurn
              ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-300/80 text-emerald-950 animate-pulse'
              : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-300/80 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isMyTurn ? (
              <Target className="w-4.5 h-4.5 text-emerald-600 animate-spin" />
            ) : (
              <Hourglass className="w-4.5 h-4.5 text-amber-600 animate-pulse" />
            )}
            <span>
              {isMyTurn ? (
                <span className="text-emerald-800 font-black">YOUR TURN! Pick a number on your board</span>
              ) : (
                <span>
                  Waiting for <strong className="text-amber-900 font-black">{currentTurnPlayerName || 'Opponent'}</strong> to pick a number...
                </span>
              )}
            </span>
          </div>
          <span
            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider ${
              isMyTurn ? 'bg-emerald-600 text-white shadow-xs' : 'bg-amber-200 text-amber-950'
            }`}
          >
            {isMyTurn ? 'Active' : 'Locked'}
          </span>
        </div>
      )}

      {/* 5x5 Bingo Grid Container */}
      <div className="bg-slate-900/5 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-inner relative">
        {/* Column Headers B-I-N-G-O with Strikethrough Cut Effect */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mb-2.5 sm:mb-3.5 text-center">
          {BINGO_LETTERS.map((letter, idx) => {
            const isCut = linesCount >= idx + 1;
            const letterGradients: Record<string, string> = {
              B: 'from-indigo-600 via-indigo-500 to-purple-600',
              I: 'from-purple-600 via-fuchsia-500 to-pink-600',
              N: 'from-emerald-500 via-teal-500 to-cyan-600',
              G: 'from-amber-500 via-orange-500 to-amber-600',
              O: 'from-rose-500 via-red-500 to-pink-600',
            };

            return (
              <div
                key={letter}
                className={`relative h-11 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl font-black text-xl sm:text-3xl text-white shadow-md border border-white/40 select-none overflow-hidden transition-all duration-300 font-display ${
                  isCut
                    ? 'bg-gradient-to-br from-rose-600 via-red-600 to-amber-500 ring-4 ring-amber-400/80 scale-[1.03] shadow-lg shadow-rose-300'
                    : `bg-gradient-to-br ${letterGradients[letter] || 'from-indigo-600 to-purple-600'}`
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
                    className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-1.5 sm:h-2.5 bg-amber-300 rounded-full shadow-lg -rotate-12 pointer-events-none z-20"
                  />
                )}

                {/* Cut Checkmark Indicator */}
                {isCut && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 z-20 bg-amber-300 text-slate-950 rounded-full p-0.5 shadow-md"
                  >
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[4]" />
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
              const isLocked = gameMode === 'multiplayer' && !isMyTurn;

              return (
                <motion.button
                  key={cell.id}
                  whileTap={isLocked ? undefined : { scale: 0.92 }}
                  onClick={() => onToggleCell(rowIndex, colIndex)}
                  disabled={isLocked}
                  className={`relative aspect-square rounded-xl sm:rounded-2xl font-extrabold text-lg sm:text-3xl flex flex-col items-center justify-center transition-all select-none overflow-hidden font-display shadow-xs ${
                    isLocked
                      ? 'cursor-not-allowed opacity-75 grayscale-20'
                      : 'cursor-pointer hover:shadow-md active:scale-95'
                  } ${
                    isWinning
                      ? 'ring-2 sm:ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-100 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white font-black shadow-xl z-10 animate-shimmer'
                      : cell.isMarked
                      ? 'bg-white text-indigo-950 border-2 border-indigo-500/90 shadow-inner'
                      : 'bg-white/95 hover:bg-white text-slate-800 border border-slate-200/90 hover:border-indigo-300'
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
                      <div className={`w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${letterColors.highlight} opacity-90 flex items-center justify-center shadow-lg border-2 border-white text-white`}>
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
