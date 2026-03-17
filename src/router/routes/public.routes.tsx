import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/HomePage'));
const MenuPage = lazy(() => import('@/features/menu'));
const DishPage = lazy(() => import('@/features/menu/pages/DishPage'));

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/menu', element: <MenuPage /> },
  { path: '/menu/:id', element: <DishPage /> },
];
