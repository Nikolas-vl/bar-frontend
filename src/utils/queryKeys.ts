import type { DishQuery } from '@/types';

export const queryKeys = {
  // Auth
  me: ['me'] as const,

  // Menu
  dishes: {
    all: ['dishes'] as const,
    list: (filters?: DishQuery) => ['dishes', 'list', filters] as const,
    detail: (id: number) => ['dishes', id] as const,
  },

  ingredients: {
    all: ['ingredients'] as const,
    list: (filters?: Record<string, unknown>) => ['ingredients', 'list', filters] as const,
    detail: (id: number) => ['ingredients', id] as const,
  },

  // Cart
  cart: {
    me: ['cart', 'me'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    mine: (filters?: { status?: string; page?: number; limit?: number }) => ['orders', 'mine', filters] as const,
    detail: (id: number) => ['orders', id] as const,
    admin: (filters?: { status?: string; page?: number; limit?: number }) => ['orders', 'admin', filters] as const,
  },

  // Reservations
  reservations: {
    all: ['reservations'] as const,
    mine: ['reservations', 'mine'] as const,
    detail: (id: number) => ['reservations', id] as const,
    admin: (filters?: { status?: string; date?: string; tableId?: number; page?: number; limit?: number }) =>
      ['reservations', 'admin', filters] as const,
  },

  // Profile
  addresses: {
    mine: ['addresses', 'mine'] as const,
  },

  paymentMethods: {
    mine: ['payment-methods', 'mine'] as const,
  },

  // Admin
  users: {
    all: ['users'] as const,
    list: (filters?: { search?: string; role?: string; page?: number; limit?: number }) =>
      ['users', 'list', filters] as const,
    detail: (id: number) => ['users', id] as const,
  },

  // Tables
  tables: {
    all: ['tables'] as const,
    list: (locationId?: number) => ['tables', 'list', locationId] as const,
  },

  // Locations
  locations: {
    all: ['locations'] as const,
    detail: (id: number) => ['locations', id] as const,
  },

  // Settings
  settings: ['settings'] as const,
};
