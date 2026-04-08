# Jolie Brasserie Café — Frontend

Production-grade React application for a restaurant ordering and management platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Architecture](#architecture)
7. [State Management](#state-management)
8. [Authentication Flow](#authentication-flow)
9. [WebSockets (Real-time)](#websockets-real-time)
10. [Content Security Policy](#content-security-policy)
11. [Styling System](#styling-system)
12. [Build and Deploy](#build-and-deploy)
13. [Known Limitations](#known-limitations)
14. [Roadmap](#roadmap)

---

## Overview

The frontend serves two distinct applications in one codebase:

- **Customer app** (`/`) — menu browsing, cart, checkout, reservations, profile management.
- **Admin panel** (`/admin`) — dashboard, orders, reservations, dishes, users, tables, locations, settings.

---

## Tech Stack

| Layer          | Technology             | Version |
| -------------- | ---------------------- | ------- |
| Framework      | React                  | 19      |
| Language       | TypeScript             | 5.9     |
| Build tool     | Vite                   | 7       |
| Routing        | React Router           | 7       |
| Server state   | TanStack Query         | 5       |
| Client state   | Zustand                | 5       |
| Forms          | React Hook Form + Zod  | 7 + 4   |
| HTTP           | Axios                  | 1       |
| Styling        | Tailwind CSS           | v4      |
| UI primitives  | Radix UI Select        | 2       |
| Date picker    | react-day-picker       | 9       |
| Date utilities | date-fns               | 4       |
| Notifications  | Sonner                 | 2       |
| Real-time      | Socket.IO client       | 4       |
| Floating UI    | @floating-ui/react-dom | —       |

---

## Project Structure

```
src/
├── app/
│   ├── layout/          # RootLayout, AdminLayout, Header, Footer, CartDrawer
│   ├── providers/       # AuthInitializer
│   ├── router/          # createBrowserRouter, route files, guards
│   └── store/           # Zustand stores (auth.store, ui.store)
│
├── features/            # Customer-facing feature modules
│   ├── auth/            # Login, Register, Google OAuth callback
│   ├── menu/            # Menu page, dish detail, filters
│   ├── cart/            # Cart drawer, cart page, hooks
│   ├── orders/          # Orders list, order detail, checkout
│   ├── reservations/    # Reservations list, new reservation form
│   ├── addresses/       # Address management
│   ├── payments/        # Payment method management
│   ├── profile/         # Profile page, password change
│   ├── locations/       # Locations section (homepage)
│   └── settings/        # Settings page (customer — placeholder)
│
├── admin/
│   ├── components/      # AdminTable, AdminModal, ConfirmDialog, etc.
│   └── features/        # Admin feature modules (same pattern as /features)
│       ├── dashboard/
│       ├── dishes/      # Dish CRUD, ingredient editor, image manager
│       ├── orders/
│       ├── reservations/
│       ├── tables/
│       ├── locations/
│       ├── users/
│       └── settings/
│
├── pages/               # Route-level page components (HomePage, NotFoundPage)
│
└── shared/
    ├── assets/          # styles/ (Tailwind CSS), icons/, images/
    ├── config/          # businessHours, category constants
    ├── constants/       # order, payment, reservation, category, user
    ├── error/           # GlobalErrorBoundary, RouteErrorBoundary, SectionErrorBoundary
    ├── hooks/           # useDebounce, useDebouncedSearch, useLogout, useBackNavigation,
    │                    # useDismissableLayer
    ├── lib/
    │   ├── api/         # Axios client + all API modules (auth, menu, cart, order, …)
    │   ├── auth/        # sessionHint (localStorage flag)
    │   ├── socket.ts    # Socket.IO singleton (connect, disconnect, getSocket)
    │   └── utils/       # cn, formatPrice, formatDate, queryKeys, pricingClient
    ├── types/           # Shared TypeScript interfaces (menu, cart, order, reservation, …)
    └── ui/              # Reusable components (Spinner, Skeleton, Select, AppImage, …)
```

Each feature module follows a consistent internal layout:

```
feature/
├── components/   # Presentational components
├── hooks/        # React Query hooks (useQuery / useMutation wrappers)
├── pages/        # Route-level components
├── schemas/      # Zod validation schemas
├── mappers/      # Form ↔ DTO transformation
├── dto/          # Data Transfer Object interfaces
└── types.ts      # Local type declarations (if needed)
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- The backend API running (see backend README)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Set VITE_API_URL to your backend URL

# 3. Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable       | Required | Example                 | Description                              |
| -------------- | -------- | ----------------------- | ---------------------------------------- |
| `VITE_API_URL` | ✅       | `http://localhost:4000` | Backend API base URL (no trailing slash) |

> All `VITE_` prefixed variables are inlined at build time. Do not put secrets here.

`.env.example`:

```dotenv
VITE_API_URL=http://localhost:4000
```

---

## Architecture

### Data Flow

```
User Interaction
    ↓
React Component
    ↓
React Hook Form (forms) / Direct handler (buttons)
    ↓
Feature Hook (useMutation / useQuery)
    ↓
TanStack Query
    ↓
Axios API Client (with interceptors)
    ↓
Backend REST API
    ↓
JSON response → TanStack Query cache → Re-render
```

### Routing

Routes are split into four groups in `src/app/router/`:

| File                  | Routes                                                          | Guard                                                      |
| --------------------- | --------------------------------------------------------------- | ---------------------------------------------------------- |
| `public.routes.tsx`   | `/`, `/menu`, `/menu/:id`                                       | None                                                       |
| `auth.routes.tsx`     | `/login`, `/register`, `/auth/google/success`                   | `GuestRoute` (redirect if already authenticated)           |
| `customer.routes.tsx` | `/cart`, `/checkout`, `/orders`, `/reservations`, `/profile`, … | `ProtectedRoute` (redirect to `/login` if unauthenticated) |
| `admin.routes.tsx`    | `/admin/**`                                                     | `AdminRoute` (must be authenticated + `ADMIN` role)        |

### URL State Management

Filters and pagination are persisted in URL query parameters (shareable, bookmarkable):

- Menu filters: `category`, `minCalories`, `maxCalories`, `search`, `sorting`
- Order filters: `status`, `page`, `limit`
- Admin filters: `status`, `page`, `date`, `location` (per feature)

Default values are **omitted** from the URL to keep links clean.

---

## State Management

### TanStack Query — Server State

Handles all asynchronous server data. Key behaviours:

- `staleTime: 2 min` globally (configurable per query)
- `retry: 1` on failure
- `refetchOnWindowFocus: false`
- Structured query keys in `src/shared/lib/utils/queryKeys.ts`

### Zustand — Client State

Two stores:

**`auth.store.ts`**

```typescript
{
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean   // true once the silent refresh attempt resolves

  setAuth(user, token): void
  clearAuth(): void
  setAccessToken(token): void
  setInitialized(): void
  updateUser(user): void
}
```

On `setAuth`, the Socket.IO connection is established. On `clearAuth`, it is torn down.

**`ui.store.ts`**

```typescript
{
  isCartOpen: boolean
  isMobileMenuOpen: boolean

  openCart / closeCart / toggleCart: () => void
  openMobileMenu / closeMobileMenu: () => void
}
```

---

## Authentication Flow

### Credentials (Email + Password)

```
1. POST /auth/login → { accessToken, user } + httpOnly refresh cookie
2. accessToken stored in Zustand (memory only — never localStorage)
3. Axios interceptor attaches Bearer token to every request
4. On 401, interceptor calls POST /auth/refresh to get a new access token
   → queues concurrent failed requests, replays them after refresh
   → on refresh failure, clears auth and redirects to /login
```

### Session Persistence (page refresh)

`AuthInitializer` runs once on app mount:

```
hasAuthSessionHint() (localStorage flag)?
  YES → POST /auth/refresh → GET /users/profile → setAuth()
  NO  → setInitialized() immediately (no network request)
```

The `sessionHint` flag is set on login and cleared on logout, preventing unnecessary refresh calls for unauthenticated visitors.

### Google OAuth

```
1. User clicks "Continue with Google"
2. window.location.href = `${API_URL}/auth/google`
3. Backend redirects through Google, then back to:
   /auth/google/success?code=<one-time-code>
4. GoogleCallbackPage calls GET /auth/google/exchange?code=<code>
5. Receives { accessToken } + refresh cookie
6. Fetches profile → setAuth() → navigate to home or /admin
```

### Axios Interceptors

The interceptor in `src/shared/lib/api/client.ts`:

- Attaches `Authorization: Bearer <token>` to every request
- On `401`: attempts silent token refresh (once per request, queue-safe)
- Guards against infinite loops on `/auth/refresh` and `/auth/*` routes
- Uses `hasAuthSessionHint()` to skip refresh for unauthenticated users

---

## WebSockets (Real-time)

See the backend [`WEBSOCKETS.md`](../backend/WEBSOCKETS.md) for the full event reference.

### Frontend Integration

The Socket.IO singleton lives in `src/shared/lib/socket.ts`:

```typescript
connectSocket(accessToken); // called from auth.store setAuth()
disconnectSocket(); // called from auth.store clearAuth()
getSocket(); // returns existing socket or throws
```

### Hooks

| Hook                   | Location                                              | Events handled                                  |
| ---------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| `useOrderSocket`       | `features/orders/hooks/useOrderSocket.ts`             | `order:status_updated`                          |
| `useAdminOrderSocket`  | `admin/features/orders/hooks/useAdminOrderSocket.ts`  | `order:new`, `order:status_updated`             |
| `useReservationSocket` | `features/reservations/hooks/useReservationSocket.ts` | `reservation:status_updated`, `reservation:new` |

All hooks:

1. Subscribe to events on mount
2. Invalidate relevant TanStack Query caches on event receipt
3. Show a `sonner` toast notification
4. Unsubscribe on unmount

Hooks are registered at the layout level:

- `RootLayout` — `useOrderSocket`, `useReservationSocket`
- `AdminLayout` — `useAdminOrderSocket`, `useReservationSocket`

---

## Content Security Policy

The production Vercel deployment (`vercel.json`) enforces a strict CSP:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com;
connect-src 'self' https://bar-backend-y9sr.onrender.com wss:;
object-src 'none';
```

**Important notes for development:**

- Google Fonts are loaded via synchronous `<link rel="stylesheet">` (not lazy-loaded `onload` pattern) to avoid inline event handler CSP violations.
- Tailwind CSS v4 uses a Vite plugin (`@tailwindcss/vite`) — no runtime style injection — so `'unsafe-inline'` in `script-src` is not needed.
- If you add new external resources (CDN, API, WebSocket), update both `vercel.json` CSP and the backend's Helmet CSP config (`src/app.ts`).

---

## Styling System

Uses **Tailwind CSS v4** with a custom design token system.

### Design Tokens

All tokens are defined in `src/shared/assets/styles/variables.css` inside `@theme {}`. Tailwind v4 automatically generates utility classes from every `--color-*`, `--font-*`, `--shadow-*`, and `--animate-*` variable.

**Brand palette:**

| Token                | Value     | Usage                      |
| -------------------- | --------- | -------------------------- |
| `--color-ob-bg`      | `#F7F6F3` | App background             |
| `--color-ob-surface` | `#FFFFFF` | Cards, modals              |
| `--color-ob-caramel` | `#9A6239` | Primary CTA, accents       |
| `--color-ob-blue`    | `#D8E7F2` | Section fills, info states |
| `--color-ob-text`    | `#2F2F2F` | Primary text               |

### CSS Architecture

| File             | Purpose                                                          |
| ---------------- | ---------------------------------------------------------------- |
| `variables.css`  | Design tokens (`@theme`)                                         |
| `reset.css`      | Base reset, scrollbar, focus ring                                |
| `components.css` | Component classes: `.btn-*`, `.card`, `.badge-*`, `.input`, etc. |
| `utilities.css`  | Custom utilities: `.text-gradient`, `.scrollbar-hide`            |

> **Rule:** `@apply` in `components.css` may only reference built-in Tailwind utilities — never other custom classes from the same file.

---

## Build and Deploy

### Production build

```bash
npm run build
# Output in dist/
```

### Preview production build locally

```bash
npm run preview
```

### Vercel deployment

The project is configured for Vercel via `vercel.json`:

- **Rewrites:** All routes → `/index.html` (SPA routing)
- **Headers:** CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`
- **Cache:** `/assets/*` → `immutable, max-age=31536000`

---

## Known Limitations

- No i18n support yet.

---

## Roadmap

- [ ] Dark / light mode toggle
- [ ] i18n (Polish + English)
- [ ] Progressive Web App (PWA) manifest + service worker
- [ ] Shared Zod schema package with backend (monorepo)
- [ ] E2E tests (Playwright)
