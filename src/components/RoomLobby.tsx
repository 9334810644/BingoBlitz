import React, { useState } from 'react';
import { Copy, Check, Crown, LogOut, Users, Send } from 'lucide-react';
import { RoomPlayer } from '../types';

interface RoomLobbyProps {
  roomCode: string;
  players: RoomPlayer[];
  localPlayerId: string;
  isHost: boolean;
  onLeaveRoom: () => void;
  onSendReaction: (emoji: string) => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  roomCode,
  players,
  localPlayerId,
  isHost,
  onLeaveRoom,
  onSendReaction,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl shadow-slate-200/50 max-w-xl mx-auto w-full text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400">Room Code</span>
              <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 tracking-wider">
                {roomCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {players.length} {players.length === 1 ? 'player' : 'players'} in room &bull; {isHost ? 'Host' : 'Member'}
            </p>
          </div>
        </div>

        {/* Copy Buttons & Leave */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all cursor-pointer border border-slate-200"
            title="Copy 6-digit Room Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Code' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs transition-all cursor-pointer border border-indigo-200"
            title="Copy Direct Join Link"
          >
            <span>Share Link</span>
          </button>
          <button
            onClick={onLeaveRoom}
            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
            title="Leave Room"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Players Roster */}
      <div className="my-4 space-y-2">
        <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider px-1">
          Live Players
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {players.map((p) => {
            const isSelf = p.id === localPlayerId;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  isSelf
                    ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 font-black text-xs text-slate-700 flex items-center justify-center">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      <span>{p.name}</span>
                      {isSelf && <span className="text-[10px] text-indigo-600 font-black">(You)</span>}
                      {p.isHost && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                  </div>
                </div>

                {p.isWon && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full border border-amber-300 animate-bounce">
                    Winner!
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Reaction Emotes Bar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
          <Send className="w-3.5 h-3.5 text-indigo-500" />
          <span>React:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {['🎉', '🔥', '😱', '👑', '👏', '💥'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSendReaction(emoji)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 active:scale-95 rounded-xl text-base sm:text-lg transition-all cursor-pointer border border-slate-200"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
