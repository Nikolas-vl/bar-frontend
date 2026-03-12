import { create } from 'zustand';
import type { User } from '../types/index';

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
  isInitialized: false,

  setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),

  setAccessToken: token => set({ accessToken: token }),

  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),

  setInitialized: () => set({ isInitialized: true }),

  updateUser: user => set({ user }),
}));
