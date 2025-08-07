import type { Socket } from "socket.io-client";

// socketTypes.ts
export interface ServerToClientEvents {
  message: (msg: string) => void;
  connect: () => void;
  disconnect: () => void;
}

export interface ClientToServerEvents {
  message: (msg: string) => void;
}

export interface SocketContextType {
  socket: Socket;
  isConnected: boolean;
}
