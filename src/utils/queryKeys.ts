export const queryKeys = {
  // Auth
  me: ['me'] as const,

  // Menu
  dishes: {
    all: ['dishes'] as const,
    list: (filters?: Record<string, unknown>) => ['dishes', 'list', filters] as const,
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
    mine: (filters?: Record<string, unknown>) => ['orders', 'mine', filters] as const,
    detail: (id: number) => ['orders', id] as const,
    admin: (filters?: Record<string, unknown>) => ['orders', 'admin', filters] as const,
  },

  // Reservations
  reservations: {
    all: ['reservations'] as const,
    mine: ['reservations', 'mine'] as const,
    detail: (id: number) => ['reservations', id] as const,
    admin: (filters?: Record<string, unknown>) => ['reservations', 'admin', filters] as const,
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
    list: (filters?: Record<string, unknown>) => ['users', 'list', filters] as const,
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
