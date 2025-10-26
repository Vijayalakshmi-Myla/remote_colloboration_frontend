"use client";
import React, { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

// Create a React context for Socket.IO
const SocketContext = createContext(null);

// Provider component
export function SocketProvider({ boardId, userId, children }) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      transports: ["websocket"],
    });

    // Join the whiteboard room
    socketRef.current.emit("whiteboard-join", { boardId, userId });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [boardId, userId]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
}

// Custom hook to access the socket
export function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.warn("useSocket must be used within a SocketProvider");
  }
  return socket;
}
