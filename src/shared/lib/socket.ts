import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket not initialised. Call connectSocket() first.');
  }
  return socket;
};

export const connectSocket = (accessToken: string): Socket => {
  if (socket?.connected) return socket;

  socket = io(API_URL, {
    auth: { token: accessToken },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
};

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
};
