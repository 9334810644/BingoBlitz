import React from 'react';
import { X, Volume2, VolumeX, Settings, MoonStar, SunMedium } from 'lucide-react';
import { SoundSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundSettings: SoundSettings;
  setSoundSettings: React.Dispatch<React.SetStateAction<SoundSettings>>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundSettings,
  setSoundSettings,
  theme,
  toggleTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl relative dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Game Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options list */}
        <div className="space-y-4 my-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/70 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {theme === 'dark' ? <MoonStar className="w-5 h-5" /> : <SunMedium className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm dark:text-slate-100">Theme</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark appearance</div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/70 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {soundSettings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm dark:text-slate-100">Sound Effects</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Audio chimes for cell marks & wins</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundSettings.soundEnabled}
              onChange={(e) => setSoundSettings((prev) => ({ ...prev, soundEnabled: e.target.checked }))}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-indigo-200"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
};
