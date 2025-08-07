import { useContext } from "react";
import type { SocketContextType } from "./socket";
import { SocketContext } from "./SocketContext";

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
