import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Play, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WinResult } from '../types';

interface VictoryModalProps {
  isOpen: boolean;
  winResult: WinResult | null;
  totalCalls: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  winResult,
  totalCalls,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-slate-800 text-center relative overflow-hidden"
        >
          {/* Decorative shine background */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-100 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-100 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy Icon Badge */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 p-1 shadow-xl shadow-indigo-200 flex items-center justify-center mb-4 ring-8 ring-indigo-50">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-indigo-600 animate-bounce" />
            </div>
          </div>

          {/* Celebratory Title */}
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-4xl sm:text-5xl font-black text-indigo-600 tracking-tight mb-2 drop-shadow-sm"
          >
            BINGO!
          </motion.h1>

          <p className="text-slate-600 font-bold text-sm sm:text-base mb-6">
            Congratulations! You completed 5 lines and spelled <span className="text-indigo-600 font-black">B-I-N-G-O</span>!
          </p>

          {/* Winning lines breakdown */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 text-left space-y-2">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Completed Lines ({winResult.winningLines.length})</span>
            </div>
            <div className="space-y-1">
              {winResult.winningLines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 cursor-pointer text-base"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200/60 text-slate-700 font-bold py-3 px-4 rounded-2xl border border-slate-200 transition-all text-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-700" />
              <span>Keep Playing</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
