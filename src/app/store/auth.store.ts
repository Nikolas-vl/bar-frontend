import { create } from 'zustand';
import type { User } from '@/shared/types';
import { clearAuthSessionHint, hasAuthSessionHint, setAuthSessionHint } from '@/shared/lib/auth/sessionHint';
import { connectSocket, disconnectSocket } from '@/shared/lib/socket';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setInitialized: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: !hasAuthSessionHint(),

  setAuth: (user, token) => {
    setAuthSessionHint();
    connectSocket(token);
    set({ user, accessToken: token, isAuthenticated: true });
  },

  setAccessToken: token => set({ accessToken: token }),

  clearAuth: () => {
    clearAuthSessionHint();
    disconnectSocket();
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  setInitialized: () => set({ isInitialized: true }),

  updateUser: user => set({ user }),
}));
