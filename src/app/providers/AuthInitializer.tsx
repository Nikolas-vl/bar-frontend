import { useEffect } from 'react';
import { authApi } from '@/shared/lib/api/auth.api';
import { useAuthStore } from '@/app/store/auth.store';
import { PageLoader } from '@/shared/ui';

interface Props {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: Props) {
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
  }, [setAuth, clearAuth, setInitialized]);

  if (!isInitialized) return <PageLoader />;

  return <>{children}</>;
}
