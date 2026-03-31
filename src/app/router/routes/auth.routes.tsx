import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { GuestRoute } from '@/app/router/guards';

const LoginPage = lazy(() => import('@/features/auth'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const GoogleCallbackPage = lazy(() => import('@/features/auth/pages/GoogleCallbackPage'));

export const authRoutes: RouteObject[] = [
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  { path: '/auth/google/success', element: <GoogleCallbackPage /> },
];
