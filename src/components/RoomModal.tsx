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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <h2 className="font-bold text-xl text-slate-900">Play Online with Friends</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 my-4">
          <button
            type="button"
            onClick={() => { setTab('create'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'create' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Room</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('join'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'join' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Join Room</span>
          </button>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mb-4 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-4">
          {/* Player Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Name / Nickname</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                maxLength={16}
                placeholder="e.g. Alex, Sam"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Room Code field if Join Tab */}
          {tab === 'join' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit Room Code</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={8}
                  placeholder="e.g. 7X9K2P"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-200 mt-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : tab === 'create' ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create & Get Room Code</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>Connect & Enter Room</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
