import React from 'react';
import { Play, Pause, FastForward, RotateCcw, Volume2, VolumeX, Sparkles, Zap } from 'lucide-react';
import { CalledBall, SoundSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BallCallerProps {
  currentBall: CalledBall | null;
  calledHistory: CalledBall[];
  isCalling: boolean;
  totalCalled: number;
  onStartCalling: () => void;
  onPauseCalling: () => void;
  onDrawNextBall: () => void;
  onResetCaller: () => void;
  soundSettings: SoundSettings;
  setSoundSettings: React.Dispatch<React.SetStateAction<SoundSettings>>;
  isWon: boolean;
}

export const BallCaller: React.FC<BallCallerProps> = ({
  currentBall,
  isCalling,
  totalCalled,
  onStartCalling,
  onPauseCalling,
  onDrawNextBall,
  onResetCaller,
  soundSettings,
  setSoundSettings,
  isWon,
}) => {
  const isFinished = totalCalled >= 25;

  const toggleVoice = () => {
    setSoundSettings((prev) => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  const toggleAutoMark = () => {
    setSoundSettings((prev) => ({ ...prev, autoMark: !prev.autoMark }));
  };

  const setSpeed = (speedMs: number) => {
    setSoundSettings((prev) => ({ ...prev, callerSpeed: speedMs }));
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl p-4 sm:p-5 flex flex-col justify-between w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isCalling ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
          <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Live Ball Caller</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
            {totalCalled} / 25 Calls
          </span>
          <button
            onClick={onResetCaller}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            title="Reset Caller"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Ball Display Container */}
      <div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-6 text-center text-white relative overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px]">
        {/* Background glow effect */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {currentBall ? (
            <motion.div
              key={currentBall.number}
              initial={{ scale: 0.2, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="flex flex-col items-center"
            >
              {/* 3D Ball Sphere */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-white via-slate-100 to-slate-300 text-slate-900 shadow-2xl ring-4 ring-white/40 flex flex-col items-center justify-center select-none overflow-hidden transform hover:scale-105 transition-transform">
                {/* Gloss highlight */}
                <div className="absolute top-1 left-3 w-10 h-5 bg-white/80 rounded-full blur-[1px] -rotate-45" />

                <span className="text-xs sm:text-sm font-black uppercase text-indigo-600 tracking-wider">
                  {currentBall.letter}
                </span>
                <span className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 leading-none">
                  {currentBall.number}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 py-4">
              <Sparkles className="w-10 h-10 text-indigo-400 animate-bounce mb-2" />
              <p className="font-bold text-sm">Ready to Draw Balls</p>
              <p className="text-xs text-slate-400">Click Start Auto-Caller or Next Ball</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Caller Action Buttons */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {!isCalling ? (
          <button
            onClick={onStartCalling}
            disabled={isFinished || isWon}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{totalCalled > 0 ? 'Resume Auto-Caller' : 'Start Auto-Caller'}</span>
          </button>
        ) : (
          <button
            onClick={onPauseCalling}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-sm"
          >
            <Pause className="w-4 h-4 fill-slate-950" />
            <span>Pause Caller</span>
          </button>
        )}

        <button
          onClick={onDrawNextBall}
          disabled={isCalling || isFinished || isWon}
          className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-sm shrink-0"
          title="Draw single next ball"
        >
          <FastForward className="w-4 h-4" />
          <span>Next Ball</span>
        </button>
      </div>

      {/* Quick Controls Bar: Speed, Voice, Auto-Mark */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600">
        {/* Speed Selector */}
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Speed:</span>
          {[
            { label: '1s', ms: 1000 },
            { label: '2s', ms: 2000 },
            { label: '3s', ms: 3000 },
          ].map((s) => (
            <button
              key={s.ms}
              onClick={() => setSpeed(s.ms)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                soundSettings.callerSpeed === s.ms
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Voice Announcement Toggle */}
        <button
          onClick={toggleVoice}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
            soundSettings.voiceEnabled
              ? 'bg-purple-50 text-purple-700 border-purple-200 font-bold'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          {soundSettings.voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-purple-600" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>Voice</span>
        </button>

        {/* Auto-Mark Toggle */}
        <button
          onClick={toggleAutoMark}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
            soundSettings.autoMark
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
          title="Automatically stamp numbers on your card when called"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Auto-Mark</span>
        </button>
      </div>
    </div>
  );
};
