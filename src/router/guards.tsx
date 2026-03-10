import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to='/login' replace />;
  if (user?.role !== 'ADMIN') return <Navigate to='/' replace />;

  return <Outlet />;
};

export const GuestRoute = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  if (isAuthenticated) return <Navigate to='/' replace />;

  return <Outlet />;
};
