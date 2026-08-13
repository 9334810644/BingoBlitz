import React from 'react';
import { X, Trophy, Flame, RotateCcw, Award } from 'lucide-react';
import { GameStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl relative dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Game Statistics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center dark:bg-indigo-950/40 dark:border-indigo-900/70">
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-300">{stats.gamesPlayed}</div>
            <div className="text-xs font-bold text-indigo-900 mt-0.5 dark:text-indigo-200">Games Played</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center dark:bg-emerald-950/40 dark:border-emerald-900/70">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-300">{winRate}%</div>
            <div className="text-xs font-bold text-emerald-900 mt-0.5 dark:text-emerald-200">Win Rate</div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center dark:bg-amber-950/40 dark:border-amber-900/70">
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-300">{stats.currentStreak}</span>
            </div>
            <div className="text-xs font-bold text-amber-900 mt-0.5 dark:text-amber-200">Current Streak</div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center dark:bg-purple-950/40 dark:border-purple-900/70">
            <div className="flex items-center justify-center gap-1">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300">{stats.bestStreak}</span>
            </div>
            <div className="text-xs font-bold text-purple-900 mt-0.5 dark:text-purple-200">Best Streak</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onResetStats}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-2 rounded-xl hover:bg-rose-50 transition-all cursor-pointer dark:hover:bg-rose-950/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-indigo-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
