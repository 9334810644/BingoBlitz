import React from 'react';
import { Volume2, VolumeX, HelpCircle, Trophy, Settings, Users, Sparkles, MoonStar, SunMedium } from 'lucide-react';
import { SoundSettings, GameMode } from '../types';

interface NavbarProps {
  soundSettings: SoundSettings;
  setSoundSettings: React.Dispatch<React.SetStateAction<SoundSettings>>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
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
  theme,
  toggleTheme,
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
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 px-3 sm:px-6 py-3 text-slate-800 shadow-sm transition-all dark:bg-slate-950/80 dark:text-slate-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300" />
            <img
              src="/logo.jpg"
              alt="BingoBlitz Logo"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover select-none shadow-md"
            />
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display dark:text-slate-100">
              Bingo<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Blitz</span>
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80 shadow-xs dark:text-indigo-300 dark:border-indigo-800/80 dark:from-indigo-950/50 dark:to-purple-950/50">
              5-Line Cut
            </span>
          </div>
        </div>

        {/* Center Tagline or Active Room Badge */}
        {gameMode === 'multiplayer' && roomCode ? (
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-3.5 py-1.5 rounded-full border border-indigo-200/80 text-xs font-bold text-indigo-950 shadow-xs dark:from-indigo-950/50 dark:to-purple-950/50 dark:text-indigo-100 dark:border-indigo-900/80">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>Room Code: <strong className="font-black text-indigo-700 tracking-wider font-mono text-sm">{roomCode}</strong></span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 bg-slate-100/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/80 text-xs font-extrabold text-slate-700 shadow-xs dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 animate-pulse" />
            <span>Cut 5 lines to spell <strong className="text-indigo-600 font-black">B-I-N-G-O</strong>!</span>
          </div>
        )}

        {/* Right side controls: Online Room, Sound, Stats, Settings, Help */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Play Online Room Button */}
          <button
            onClick={onOpenRoomModal}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all active:scale-95 cursor-pointer border ${
              gameMode === 'multiplayer'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-md shadow-indigo-200'
                : 'bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 border-indigo-200/80 shadow-xs'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{gameMode === 'multiplayer' ? 'In Room' : 'Play Online'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl border border-slate-200/80 bg-slate-100/90 text-slate-700 shadow-xs transition-all active:scale-95 cursor-pointer hover:bg-slate-200/70 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-700/70"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunMedium className="w-4.5 h-4.5" /> : <MoonStar className="w-4.5 h-4.5" />}
          </button>

          {/* Quick Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              soundSettings.soundEnabled
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-xs hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-900/80 dark:hover:bg-indigo-900/70'
                : 'bg-slate-100/90 text-slate-400 border-slate-200 hover:bg-slate-200/70 hover:text-slate-800 dark:bg-slate-800/70 dark:border-slate-700 dark:hover:bg-slate-700/70 dark:hover:text-slate-100'
            }`}
            title={soundSettings.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundSettings.soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            className="p-2 sm:px-3 sm:py-2 bg-slate-100/90 hover:bg-slate-200/70 text-slate-700 border border-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs dark:bg-slate-800/70 dark:hover:bg-slate-700/70 dark:text-slate-200 dark:border-slate-700"
            title="Statistics"
          >
            <Trophy className="w-4.5 h-4.5 text-amber-500" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-100/90 hover:bg-slate-200/70 text-slate-700 border border-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
            title="Game Settings"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          {/* How To Play */}
          <button
            onClick={onOpenHowToPlay}
            className="p-2 bg-slate-100/90 hover:bg-slate-200/70 text-slate-700 border border-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
            title="How to Play"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
