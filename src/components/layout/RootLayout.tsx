import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './Header';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import { PageLoader } from '../ui/PageLoader';

export const RootLayout = () => {
  const { setAuth, clearAuth, setInitialized, isInitialized } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      try {
        const { accessToken } = await authApi.refresh();
        const user = await authApi.me();
        setAuth(user, accessToken);
      } catch {
        clearAuth();
      } finally {
        setInitialized();
      }
    };

    init();
  }, []);

  if (!isInitialized) return <PageLoader />;

  return (
    <div className='min-h-screen bg-dark-900 flex flex-col'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};
