import React, { useState } from 'react';
import { Copy, Check, Crown, LogOut, Users, Send } from 'lucide-react';
import { RoomPlayer } from '../types';

interface RoomLobbyProps {
  roomCode: string;
  players: RoomPlayer[];
  localPlayerId: string;
  isHost: boolean;
  currentTurnPlayerId?: string | null;
  onLeaveRoom: () => void;
  onSendReaction: (emoji: string) => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  roomCode,
  players,
  localPlayerId,
  isHost,
  currentTurnPlayerId,
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
    <div className="glass-panel border border-white/80 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-300/50 max-w-xl mx-auto w-full text-slate-800 relative z-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 border border-white/40 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Users className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Room Code</span>
              <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200/80 tracking-widest font-mono shadow-xs">
                {roomCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              {players.length} {players.length === 1 ? 'player' : 'players'} connected &bull; {isHost ? 'Host' : 'Member'}
            </p>
          </div>
        </div>

        {/* Copy Buttons & Leave */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 font-extrabold text-xs transition-all active:scale-95 cursor-pointer border border-slate-200 shadow-xs"
            title="Copy 6-digit Room Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 font-extrabold text-xs transition-all active:scale-95 cursor-pointer border border-indigo-200/80 shadow-xs"
            title="Copy Direct Join Link"
          >
            <span>Share Link</span>
          </button>
          <button
            onClick={onLeaveRoom}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 transition-all active:scale-95 cursor-pointer shadow-xs"
            title="Leave Room"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Players Roster */}
      <div className="my-4 space-y-2">
        <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-1 flex items-center justify-between">
          <span>Live Room Players</span>
          <span className="text-[10px] text-indigo-600 font-bold lowercase bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            Turn-based rules active
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {players.map((p) => {
            const isSelf = p.id === localPlayerId;
            const isTurn = currentTurnPlayerId ? p.id === currentTurnPlayerId : p.isHost;

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isTurn
                    ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-400 text-emerald-950 font-extrabold shadow-md'
                    : isSelf
                    ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950 font-bold'
                    : 'bg-white/90 border-slate-200/90 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shadow-xs ${
                    isTurn ? 'bg-emerald-600 text-white animate-bounce' : 'bg-gradient-to-tr from-slate-200 to-slate-300 text-slate-700'
                  }`}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {isSelf && <span className="text-[10px] text-indigo-600 font-black">(You)</span>}
                      {p.isHost && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isTurn && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                      Turn
                    </span>
                  )}
                  {p.isWon && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full border border-amber-300 animate-bounce shadow-xs">
                      Winner!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Reaction Emotes Bar */}
      <div className="pt-3.5 border-t border-slate-200/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500">
          <Send className="w-4 h-4 text-indigo-600" />
          <span>React:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {['🎉', '🔥', '😱', '👑', '👏', '💥'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSendReaction(emoji)}
              className="px-3 py-1.5 bg-slate-100/90 hover:bg-white active:scale-95 rounded-xl text-lg transition-all cursor-pointer border border-slate-200 shadow-xs hover:shadow-md"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
