import React, { useState } from 'react';
import { X, Users, Key, User, PlusCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (playerName: string) => Promise<void>;
  onJoinRoom: (playerName: string, roomCode: string) => Promise<void>;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('bingoblitz_player_name') || localStorage.getItem('bingo_player_name') || '';
  });
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setErrorMsg('Please enter your name');
      return;
    }

    localStorage.setItem('bingoblitz_player_name', trimmedName);
    setIsLoading(true);

    try {
      if (tab === 'create') {
        await onCreateRoom(trimmedName);
      } else {
        const trimmedCode = roomCodeInput.trim();
        if (!trimmedCode) {
          setErrorMsg('Please enter a 6-digit Room Code');
          setIsLoading(false);
          return;
        }
        await onJoinRoom(trimmedName, trimmedCode);
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error?.message || 'Connection failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="glass-panel border border-white/80 rounded-3xl max-w-md w-full p-6 sm:p-7 text-slate-800 shadow-2xl relative z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-slate-900 font-display">Play Online</h2>
              <p className="text-xs font-semibold text-slate-500">Host or join a synchronized room</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100/80 hover:bg-slate-200/70 transition-all active:scale-95 cursor-pointer border border-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 my-5">
          <button
            type="button"
            onClick={() => { setTab('create'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer ${
              tab === 'create'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Room</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('join'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer ${
              tab === 'join'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Join Room</span>
          </button>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mb-4 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-4">
          {/* Player Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Name / Nickname</label>
            <div className="relative">
              <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                maxLength={16}
                placeholder="e.g. Alex, Sam"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:bg-white shadow-inner transition-all"
              />
            </div>
          </div>

          {/* Room Code field if Join Tab */}
          {tab === 'join' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">6-Digit Room Code</label>
              <div className="relative">
                <Key className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={8}
                  placeholder="e.g. 7X9K2P"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-2xl text-sm font-black text-indigo-900 tracking-widest uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:bg-white shadow-inner transition-all"
                />
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-2xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-indigo-200 mt-6 text-sm"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : tab === 'create' ? (
              <>
                <Sparkles className="w-4.5 h-4.5" />
                <span>Create & Get Room Code</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-4.5 h-4.5" />
                <span>Connect & Enter Room</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
