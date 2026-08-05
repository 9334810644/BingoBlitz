import Peer, { DataConnection } from 'peerjs';
import { RoomPlayer, MultiplayerMessage } from '../types';

export function generateRoomCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export type MessageHandler = (msg: MultiplayerMessage) => void;
export type StatusHandler = (status: 'disconnected' | 'connecting' | 'connected' | 'error', errorMsg?: string) => void;

export class RoomManager {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private isHost: boolean = false;
  private roomId: string = '';
  private localPlayer: RoomPlayer | null = null;
  private messageHandlers: MessageHandler[] = [];
  private statusHandlers: StatusHandler[] = [];

  public getRoomId(): string {
    return this.roomId;
  }

  public getIsHost(): boolean {
    return this.isHost;
  }

  public getLocalPlayer(): RoomPlayer | null {
    return this.localPlayer;
  }

  public onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  public onStatus(handler: StatusHandler) {
    this.statusHandlers.push(handler);
  }

  private notifyStatus(status: 'disconnected' | 'connecting' | 'connected' | 'error', errorMsg?: string) {
    this.statusHandlers.forEach((h) => h(status, errorMsg));
  }

  private notifyMessage(msg: MultiplayerMessage) {
    this.messageHandlers.forEach((h) => h(msg));
  }

  // Create Room as Host
  public createRoom(playerName: string, customCode?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.disconnect();
      const code = customCode || generateRoomCode();
      this.roomId = code.toUpperCase();
      this.isHost = true;

      const peerId = `bingoblitz-room-${this.roomId.toLowerCase()}`;
      this.localPlayer = {
        id: peerId,
        name: playerName,
        isHost: true,
        linesCount: 0,
        isWon: false,
      };

      this.notifyStatus('connecting');
      this.peer = new Peer(peerId, { debug: 1 });

      this.peer.on('open', (id) => {
        console.log('Room Host Created:', id);
        this.notifyStatus('connected');
        resolve(this.roomId);
      });

      this.peer.on('connection', (conn) => {
        this.setupHostConnection(conn);
      });

      this.peer.on('error', (err) => {
        console.error('Peer Host Error:', err);
        this.notifyStatus('error', err.message);
        reject(err);
      });
    });
  }

  // Join Room as Guest
  public joinRoom(playerName: string, roomCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.disconnect();
      this.roomId = roomCode.trim().toUpperCase();
      this.isHost = false;

      const guestPeerId = `bingoblitz-guest-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const hostPeerId = `bingoblitz-room-${this.roomId.toLowerCase()}`;

      this.localPlayer = {
        id: guestPeerId,
        name: playerName,
        isHost: false,
        linesCount: 0,
        isWon: false,
      };

      this.notifyStatus('connecting');
      this.peer = new Peer(guestPeerId, { debug: 1 });

      this.peer.on('open', () => {
        const conn = this.peer!.connect(hostPeerId, { reliable: true });

        conn.on('open', () => {
          console.log('Connected to Host!');
          this.connections.set('host', conn);
          this.notifyStatus('connected');

          // Send join request
          conn.send({
            type: 'JOIN_REQUEST',
            player: this.localPlayer,
          } as MultiplayerMessage);

          resolve();
        });

        conn.on('data', (data) => {
          this.notifyMessage(data as MultiplayerMessage);
        });

        conn.on('close', () => {
          this.notifyStatus('disconnected', 'Host disconnected');
        });

        conn.on('error', (err) => {
          this.notifyStatus('error', err.message);
        });
      });

      this.peer.on('error', (err) => {
        console.error('Peer Guest Error:', err);
        this.notifyStatus('error', 'Room not found or host offline');
        reject(err);
      });
    });
  }

  private setupHostConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
    });

    conn.on('data', (data) => {
      const msg = data as MultiplayerMessage;

      // Broadcast message to all other connected peers
      this.broadcast(msg, conn.peer);
      this.notifyMessage(msg);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
    });
  }

  public broadcast(msg: MultiplayerMessage, excludePeerId?: string) {
    this.connections.forEach((conn, peerId) => {
      if (peerId !== excludePeerId && conn.open) {
        conn.send(msg);
      }
    });
  }

  public sendMessage(msg: MultiplayerMessage) {
    if (this.isHost) {
      this.broadcast(msg);
    } else {
      const hostConn = this.connections.get('host');
      if (hostConn && hostConn.open) {
        hostConn.send(msg);
      }
    }
  }

  public disconnect() {
    this.connections.forEach((conn) => conn.close());
    this.connections.clear();

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.localPlayer = null;
    this.roomId = '';
    this.isHost = false;
    this.notifyStatus('disconnected');
  }
}

export const roomManager = new RoomManager();
