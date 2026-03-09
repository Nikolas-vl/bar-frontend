import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const ProtectedRoute = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) return null; // wait for auth check

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) return null;

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export const GuestRoute = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) return null;

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
