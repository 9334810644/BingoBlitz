import React from 'react';
import { X, Volume2, VolumeX, Settings } from 'lucide-react';
import { SoundSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundSettings: SoundSettings;
  setSoundSettings: React.Dispatch<React.SetStateAction<SoundSettings>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundSettings,
  setSoundSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h2 className="font-bold text-xl text-slate-900">Game Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options list */}
        <div className="space-y-4 my-6">
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                {soundSettings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Sound Effects</div>
                <div className="text-xs text-slate-500">Audio chimes for cell marks & wins</div>
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
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
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
