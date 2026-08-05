import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BingoCard } from './components/BingoCard';
import { RoomModal } from './components/RoomModal';
import { RoomLobby } from './components/RoomLobby';
import { VictoryModal } from './components/VictoryModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import {
  Cell,
  GameStatus,
  GameMode,
  GamePattern,
  GameStats,
  SoundSettings,
  RoomPlayer,
  MultiplayerMessage,
} from './types';
import {
  generateBingoCard,
  checkWinPattern,
} from './utils/bingo';
import {
  playMarkSound,
  playUnmarkSound,
  playBingoWinSound,
} from './utils/audio';
import { roomManager } from './utils/roomPeer';
import { motion, AnimatePresence } from 'motion/react';

const SOUND_STORAGE_KEY = 'bingoblitz_sound_v4';
const STATS_STORAGE_KEY = 'bingoblitz_stats_v4';

export default function App() {
  // Card Grid State
  const [grid, setGrid] = useState<Cell[][]>(() => generateBingoCard());
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [gamePattern] = useState<GamePattern>('line');

  // Multiplayer State
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomPlayers, setRoomPlayers] = useState<RoomPlayer[]>([]);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<Array<{ id: string; emoji: string; sender: string }>>([]);

  // Modals
  const [showRoomModal, setShowRoomModal] = useState<boolean>(false);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Sound Settings
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Load sound settings failed', e);
    }
    return { soundEnabled: true };
  });

  // Game Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Load stats failed', e);
    }
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      bestStreak: 0,
    };
  });

  // Save Settings & Stats
  useEffect(() => {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(soundSettings));
    } catch (e) {
      console.warn('Save sound failed', e);
    }
  }, [soundSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Save stats failed', e);
    }
  }, [stats]);

  // Win Detection
  const winResult = checkWinPattern(grid, gamePattern);

  // Broadcast progress update in Multiplayer mode whenever winning lines count changes
  useEffect(() => {
    if (gameMode === 'multiplayer' && roomManager.getLocalPlayer()) {
      const localPlayer = roomManager.getLocalPlayer()!;
      const msg: MultiplayerMessage = {
        type: 'PROGRESS_UPDATE',
        playerId: localPlayer.id,
        linesCount: winResult.winningLines.length,
        isWon: winResult.isWin,
      };
      roomManager.sendMessage(msg);

      // Also update local roomPlayers state
      setRoomPlayers((prev) =>
        prev.map((p) =>
          p.id === localPlayer.id
            ? { ...p, linesCount: winResult.winningLines.length, isWon: winResult.isWin }
            : p
        )
      );
    }
  }, [winResult.winningLines.length, winResult.isWin, gameMode]);

  // Handle Victory event
  useEffect(() => {
    if (winResult.isWin && gameStatus !== 'won') {
      setGameStatus('won');
      setShowVictoryModal(true);
      playBingoWinSound(soundSettings.soundEnabled);

      setStats((prev) => {
        const newWon = prev.gamesWon + 1;
        const newStreak = prev.currentStreak + 1;
        return {
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: newWon,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        };
      });
    }
  }, [winResult.isWin, gameStatus, soundSettings.soundEnabled]);

  // Network Message Listener Setup
  useEffect(() => {
    roomManager.onMessage((msg: MultiplayerMessage) => {
      if (msg.type === 'JOIN_REQUEST' && msg.player) {
        // Host received join request
        setRoomPlayers((prev) => {
          if (prev.some((p) => p.id === msg.player!.id)) return prev;
          const updated = [...prev, msg.player!];
          const activeTurn = currentTurnPlayerId || updated[0].id;
          // Host broadcasts updated room state & current turn
          roomManager.broadcast({
            type: 'ROOM_STATE',
            players: updated,
            currentTurnPlayerId: activeTurn,
          });
          return updated;
        });
      } else if (msg.type === 'ROOM_STATE' && msg.players) {
        setRoomPlayers(msg.players);
        if (msg.currentTurnPlayerId) {
          setCurrentTurnPlayerId(msg.currentTurnPlayerId);
        } else if (msg.players.length > 0) {
          setCurrentTurnPlayerId(msg.players[0].id);
        }
      } else if (msg.type === 'NUMBER_CALLED' && typeof msg.number === 'number') {
        const num = msg.number;
        const nextState = msg.isMarked !== undefined ? msg.isMarked : true;
        setGrid((prevGrid) =>
          prevGrid.map((row) =>
            row.map((cell) => {
              if (cell.number === num) {
                return { ...cell, isMarked: nextState };
              }
              return cell;
            })
          )
        );

        if (msg.nextTurnPlayerId) {
          setCurrentTurnPlayerId(msg.nextTurnPlayerId);
        }

        if (nextState) {
          playMarkSound(soundSettings.soundEnabled);
        } else {
          playUnmarkSound(soundSettings.soundEnabled);
        }

        // Show live call toast notification
        const id = `rx-${Date.now()}-${Math.random()}`;
        const text = `${msg.calledBy || 'Friend'} picked #${num}`;
        setFloatingReactions((prev) => [...prev, { id, emoji: '📌', sender: text }]);
        setTimeout(() => {
          setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
        }, 3000);
      } else if (msg.type === 'PROGRESS_UPDATE' && msg.playerId) {
        setRoomPlayers((prev) =>
          prev.map((p) =>
            p.id === msg.playerId
              ? { ...p, linesCount: msg.linesCount ?? p.linesCount, isWon: msg.isWon ?? p.isWon }
              : p
          )
        );
      } else if (msg.type === 'REACTION' && msg.emoji) {
        const id = `rx-${Date.now()}-${Math.random()}`;
        setFloatingReactions((prev) => [...prev, { id, emoji: msg.emoji!, sender: msg.senderName || 'Friend' }]);

        setTimeout(() => {
          setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
        }, 3000);
      } else if (msg.type === 'RESTART_GAME') {
        setGrid(generateBingoCard());
        setGameStatus('idle');
        setShowVictoryModal(false);
        if (msg.currentTurnPlayerId) {
          setCurrentTurnPlayerId(msg.currentTurnPlayerId);
        }
      }
    });

    roomManager.onStatus((status) => {
      if (status === 'disconnected') {
        setGameMode('solo');
        setRoomCode(null);
        setRoomPlayers([]);
        setCurrentTurnPlayerId(null);
      }
    });
  }, [soundSettings.soundEnabled, currentTurnPlayerId]);

  // Auto join room if URL contains ?room=XXXXXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && !roomCode) {
      setShowRoomModal(true);
    }
  }, [roomCode]);

  // Create Room Handler
  const handleCreateRoom = async (playerName: string) => {
    const code = await roomManager.createRoom(playerName);
    setRoomCode(code);
    setGameMode('multiplayer');

    const hostPlayer = roomManager.getLocalPlayer()!;
    setRoomPlayers([hostPlayer]);
    setCurrentTurnPlayerId(hostPlayer.id);
  };

  // Join Room Handler
  const handleJoinRoom = async (playerName: string, code: string) => {
    await roomManager.joinRoom(playerName, code);
    setRoomCode(code);
    setGameMode('multiplayer');

    const localPlayer = roomManager.getLocalPlayer()!;
    setRoomPlayers([localPlayer]);
  };

  const handleLeaveRoom = () => {
    roomManager.disconnect();
    setGameMode('solo');
    setRoomCode(null);
    setRoomPlayers([]);
    setCurrentTurnPlayerId(null);
  };

  const handleSendReaction = (emoji: string) => {
    const localPlayer = roomManager.getLocalPlayer();
    const senderName = localPlayer ? localPlayer.name : 'You';
    const msg: MultiplayerMessage = {
      type: 'REACTION',
      senderName,
      emoji,
    };
    roomManager.sendMessage(msg);

    // Trigger local floating reaction
    const id = `rx-${Date.now()}-${Math.random()}`;
    setFloatingReactions((prev) => [...prev, { id, emoji, sender: senderName }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 3000);
  };

  // Toggle cell mark state manually & broadcast to online room
  const handleToggleCell = (rowIndex: number, colIndex: number) => {
    const targetCell = grid[rowIndex][colIndex];
    if (targetCell.isFree) return;

    const localPlayer = roomManager.getLocalPlayer();
    const activeTurnId = currentTurnPlayerId || roomPlayers[0]?.id;

    // In multiplayer mode, enforce strict turn order and prevent re-tapping already marked cells
    if (gameMode === 'multiplayer') {
      if (localPlayer && activeTurnId && activeTurnId !== localPlayer.id) {
        const turnPlayer = roomPlayers.find((p) => p.id === activeTurnId);
        const id = `rx-${Date.now()}-${Math.random()}`;
        setFloatingReactions((prev) => [
          ...prev,
          { id, emoji: '⏳', sender: `Wait for ${turnPlayer?.name || 'opponent'}'s turn!` },
        ]);
        setTimeout(() => {
          setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
        }, 2500);
        return;
      }

      if (targetCell.isMarked) return;
    }

    const newMarkedState = !targetCell.isMarked;

    if (newMarkedState) {
      playMarkSound(soundSettings.soundEnabled);
    } else {
      playUnmarkSound(soundSettings.soundEnabled);
    }

    const newGrid = grid.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          return { ...cell, isMarked: newMarkedState };
        }
        return cell;
      })
    );

    setGrid(newGrid);

    // Calculate next turn player in round-robin order
    let nextTurnId: string | undefined = undefined;
    if (gameMode === 'multiplayer' && roomPlayers.length > 1 && localPlayer) {
      const currentIdx = roomPlayers.findIndex((p) => p.id === localPlayer.id);
      const nextIdx = currentIdx !== -1 ? (currentIdx + 1) % roomPlayers.length : 0;
      nextTurnId = roomPlayers[nextIdx].id;
      setCurrentTurnPlayerId(nextTurnId);
    }

    // Broadcast number tap to online room along with next turn player
    if (gameMode === 'multiplayer') {
      roomManager.sendMessage({
        type: 'NUMBER_CALLED',
        number: targetCell.number,
        isMarked: newMarkedState,
        calledBy: localPlayer ? localPlayer.name : 'A friend',
        nextTurnPlayerId: nextTurnId,
      });
    }

    // Revert game status if unmarking drops below 5 lines after won
    const newWinCheck = checkWinPattern(newGrid, gamePattern);
    if (!newWinCheck.isWin && gameStatus === 'won') {
      setGameStatus('idle');
    }
  };

  const handleNewCard = () => {
    setGrid(generateBingoCard());
    setGameStatus('idle');
    setShowVictoryModal(false);

    const firstPlayerId = roomPlayers[0]?.id;

    if (gameMode === 'multiplayer') {
      if (firstPlayerId) setCurrentTurnPlayerId(firstPlayerId);
      roomManager.sendMessage({
        type: 'RESTART_GAME',
        currentTurnPlayerId: firstPlayerId,
      });
    }
  };

  const handleResetStats = () => {
    setStats({
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      bestStreak: 0,
    });
  };

  const localPlayer = roomManager.getLocalPlayer();
  const activeTurnId = currentTurnPlayerId || roomPlayers[0]?.id;
  const isMyTurn = gameMode === 'solo' || (localPlayer ? activeTurnId === localPlayer.id : true);
  const currentTurnPlayer = roomPlayers.find((p) => p.id === activeTurnId);
  const currentTurnPlayerName = currentTurnPlayer
    ? currentTurnPlayer.id === localPlayer?.id
      ? 'You'
      : currentTurnPlayer.name
    : 'Friend';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-indigo-500/15 rounded-full blur-3xl animate-ambient" />
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-purple-500/15 rounded-full blur-3xl animate-ambient" style={{ animationDelay: '4s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-pink-500/15 rounded-full blur-3xl animate-ambient" style={{ animationDelay: '8s' }} />
      </div>

      {/* Floating Reactions Container */}
      <div className="fixed bottom-12 right-6 z-40 pointer-events-none flex flex-col gap-2 items-end">
        <AnimatePresence>
          {floatingReactions.map((rx) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1.2 }}
              exit={{ opacity: 0, y: -40, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="glass-panel border border-slate-200/80 shadow-2xl rounded-2xl px-4 py-2 flex items-center gap-2 text-sm font-extrabold text-slate-800"
            >
              <span className="text-2xl">{rx.emoji}</span>
              <span className="text-xs text-indigo-600 font-extrabold">{rx.sender}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Bar */}
      <Navbar
        soundSettings={soundSettings}
        setSoundSettings={setSoundSettings}
        gameMode={gameMode}
        roomCode={roomCode}
        onOpenRoomModal={() => setShowRoomModal(true)}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenStats={() => setShowStatsModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 flex flex-col items-center justify-start gap-5">
        {/* Render Online Room Lobby Bar when in Multiplayer mode */}
        {gameMode === 'multiplayer' && roomCode && (
          <RoomLobby
            roomCode={roomCode}
            players={roomPlayers}
            localPlayerId={roomManager.getLocalPlayer()?.id || ''}
            isHost={roomManager.getIsHost()}
            currentTurnPlayerId={activeTurnId}
            onLeaveRoom={handleLeaveRoom}
            onSendReaction={handleSendReaction}
          />
        )}

        {/* 5x5 Bingo Card Hero Component */}
        <div className="w-full max-w-xl flex justify-center">
          <BingoCard
            grid={grid}
            onToggleCell={handleToggleCell}
            onNewCard={handleNewCard}
            isGameActive={false}
            winningCellIds={winResult.winningCellIds}
            winningLines={winResult.winningLines}
            winningLineDetails={winResult.winningLineDetails}
            gameMode={gameMode}
            isMyTurn={isMyTurn}
            currentTurnPlayerName={currentTurnPlayerName}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BingoBlitz &bull; Online Synchronized 5x5 Bingo Game</span>
          <div className="flex gap-4 text-slate-600 font-medium">
            <button
              onClick={() => setShowRoomModal(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer font-bold text-indigo-600"
            >
              Play Online
            </button>
            <button
              onClick={() => setShowHowToPlay(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Rules
            </button>
            <button
              onClick={() => setShowStatsModal(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Stats
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Online Room Modal */}
      <RoomModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={showVictoryModal}
        winResult={winResult}
        totalCalls={0}
        onPlayAgain={handleNewCard}
        onClose={() => setShowVictoryModal(false)}
      />

      {/* Rulebook Modal */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      {/* Statistics Modal */}
      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={stats}
        onResetStats={handleResetStats}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        soundSettings={soundSettings}
        setSoundSettings={setSoundSettings}
      />
    </div>
  );
}
