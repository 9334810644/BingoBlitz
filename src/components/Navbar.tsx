import React from 'react';
import { Volume2, VolumeX, HelpCircle, Trophy, Settings, Users, Sparkles } from 'lucide-react';
import { SoundSettings, GameMode } from '../types';

interface NavbarProps {
  soundSettings: SoundSettings;
  setSoundSettings: React.Dispatch<React.SetStateAction<SoundSettings>>;
  gameMode: GameMode;
  roomCode: string | null;
  onOpenRoomModal: () => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundSettings,
  setSoundSettings,
  gameMode,
  roomCode,
  onOpenRoomModal,
  onOpenHowToPlay,
  onOpenStats,
  onOpenSettings,
}) => {
  const toggleSound = () => {
    setSoundSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-3 sm:px-4 py-2.5 sm:py-3 text-slate-800 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2.5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="BingoBlitz Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shadow-md shadow-indigo-200 select-none border border-slate-200/50"
          />
          <div className="flex items-baseline gap-1.5">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
              Bingo<span className="text-indigo-600">Blitz</span>
            </h1>
            <span className="hidden sm:inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              5-Line Cut
            </span>
          </div>
        </div>

        {/* Center Tagline or Active Room Badge */}
        {gameMode === 'multiplayer' && roomCode ? (
          <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 text-xs font-bold text-indigo-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Room Code: <strong className="font-black text-indigo-600 tracking-wider">{roomCode}</strong></span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100/90 px-3 py-1 rounded-full border border-slate-200 text-xs font-extrabold text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Cut 5 lines to spell B-I-N-G-O!</span>
          </div>
        )}

        {/* Right side controls: Online Room, Sound, Stats, Settings, Help */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Play Online Room Button */}
          <button
            onClick={onOpenRoomModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer border ${
              gameMode === 'multiplayer'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-200'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{gameMode === 'multiplayer' ? 'In Room' : 'Play Online'}</span>
          </button>

          {/* Quick Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
              soundSettings.soundEnabled
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
            title={soundSettings.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            className="p-1.5 sm:p-2 bg-slate-100 hover:bg-slate-200/60 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Statistics"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 bg-slate-100 hover:bg-slate-200/60 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="Game Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* How To Play */}
          <button
            onClick={onOpenHowToPlay}
            className="p-1.5 sm:p-2 bg-slate-100 hover:bg-slate-200/60 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
