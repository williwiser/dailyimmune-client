// SocketContext.tsx
import React, { useEffect, useState, type ReactNode } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";

// Create socket instance (singleton)
const socket = io("http://localhost:3000", {
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

    socket.on(
      "receive-message",
      ({ sender, message, roomId, senderId, recipientId }) => {
        console.log("📩 Message received from:", sender);
        console.log("💬 Message:", message);
        console.log(
          "roomId:",
          roomId,
          "senderId:",
          senderId,
          "recipientId:",
          recipientId
        );

        // If you have state for messages, you can update it here
        // setMessages(prev => [...prev, { sender, message }]);
      }
    );

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // socket.on("test", (value) => {
    //   console.log(`Received it!: ${value}`);
    //   alert(`Received it!: ${value}`);
    // });

    socket.on("message", (msg) => {
      console.log("📩 Message received:", msg);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("test");
      socket.off("message");
      socket.off("receive-message");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
