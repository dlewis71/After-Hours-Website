import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Safety check
    if (!import.meta.env.VITE_BACKEND_URL && !window.location.hostname) return;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const newSocket = io(BACKEND_URL, {
      // -----------------------------------------------------------
      // 👇 THE FIX: Force "polling" first (or only polling)
      // This bypasses the WebSocket handshake loop immediately.
      // -----------------------------------------------------------
      transports: ["polling"], 
      
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect_error", (err) => {
      console.warn("Socket connection failed:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);