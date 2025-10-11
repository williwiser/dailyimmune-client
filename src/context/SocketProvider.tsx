// SocketContext.tsx
import React, { useEffect, useState, type ReactNode } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Create socket instance (singleton)
const socket = io(BACKEND_URL, {
  autoConnect: true,
  withCredentials: true,
});

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log(`✅ Socket connected: ${socket.id}`);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
