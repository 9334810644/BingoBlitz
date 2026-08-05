export type BingoLetter = 'B' | 'I' | 'N' | 'G' | 'O';

export interface Cell {
  id: string;
  number: number;
  letter: BingoLetter;
  row: number;
  col: number;
  isMarked: boolean;
  isFree: boolean;
  isWinningCell?: boolean;
}

export type GameStatus = 'idle' | 'won';
export type GamePattern = 'line';
export type GameMode = 'solo' | 'multiplayer';

export interface WinningLineDetail {
  type: 'row' | 'col' | 'diag-main' | 'diag-anti';
  index: number;
  label: string;
}

export interface WinResult {
  isWin: boolean;
  winningCellIds: Set<string>;
  winningLines: string[];
  winningLineDetails: WinningLineDetail[];
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
}

export interface CalledBall {
  number: number;
  letter: BingoLetter;
}

export interface SoundSettings {
  soundEnabled: boolean;
  voiceEnabled?: boolean;
  autoMark?: boolean;
  callerSpeed?: number;
}

// Multiplayer Online Room Interfaces
export interface RoomPlayer {
  id: string;
  name: string;
  isHost: boolean;
  linesCount: number;
  isWon: boolean;
}

export type MultiplayerMessageType =
  | 'JOIN_REQUEST'
  | 'ROOM_STATE'
  | 'NUMBER_CALLED'
  | 'PROGRESS_UPDATE'
  | 'REACTION'
  | 'RESTART_GAME';

export interface MultiplayerMessage {
  type: MultiplayerMessageType;
  player?: RoomPlayer;
  players?: RoomPlayer[];
  number?: number;
  isMarked?: boolean;
  calledBy?: string;
  calledNumbers?: number[];
  playerId?: string;
  linesCount?: number;
  isWon?: boolean;
  senderName?: string;
  emoji?: string;
}
