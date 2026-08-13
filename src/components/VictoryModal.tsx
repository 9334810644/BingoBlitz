import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Play, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WinResult } from '../types';

interface VictoryModalProps {
  isOpen: boolean;
  winResult: WinResult | null;
  totalCalls: number;
  winnerName?: string;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  winResult,
  totalCalls,
  winnerName = 'You',
  onPlayAgain,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger canvas confetti celebration burst!
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen]);

  if (!isOpen || !winResult) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="glass-panel border border-white/80 rounded-3xl p-7 sm:p-9 max-w-md w-full shadow-2xl text-slate-800 text-center relative overflow-hidden z-10 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-100"
        >
          {/* Decorative shine background */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy Icon Badge */}
          <div className="mx-auto w-22 h-22 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-1 shadow-2xl shadow-amber-300 flex items-center justify-center mb-5 ring-8 ring-amber-100/60">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner">
              <Trophy className="w-11 h-11 text-amber-500 animate-bounce" />
            </div>
          </div>

          {/* Celebratory Title */}
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight mb-2 drop-shadow-sm font-display"
          >
            BINGO!
          </motion.h1>

          <p className="text-slate-600 font-extrabold text-sm sm:text-base mb-6 dark:text-slate-300">
            <span className="text-indigo-700 font-black dark:text-indigo-400">{winnerName}</span> completed 5 lines and spelled <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-black font-display text-lg">B-I-N-G-O</span>!
          </p>

          {/* Winning lines breakdown */}
          <div className="bg-slate-50/90 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 mb-6 text-left space-y-2 shadow-inner dark:bg-slate-800/70 dark:border-slate-700">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 flex items-center gap-1.5 mb-2 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Completed Lines ({winResult.winningLines.length})</span>
            </div>
            <div className="space-y-1.5">
              {winResult.winningLines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-4.5 h-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold py-3.5 px-5 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 cursor-pointer text-base"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 font-extrabold py-3.5 px-4 rounded-2xl border border-slate-200/80 transition-all active:scale-95 text-sm cursor-pointer shadow-xs dark:bg-slate-800/70 dark:hover:bg-slate-700/70 dark:text-slate-100 dark:border-slate-700"
            >
              <Play className="w-4 h-4 fill-slate-800" />
              <span>Keep Playing</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
