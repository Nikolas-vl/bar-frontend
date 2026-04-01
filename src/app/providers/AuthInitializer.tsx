import { useEffect } from 'react';
import { authApi } from '@/shared/lib/api/auth.api';
import { useAuthStore } from '@/app/store/auth.store';
import { PageLoader } from '@/shared/ui';
import { hasAuthSessionHint } from '@/shared/lib/auth/sessionHint';

interface Props {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: Props) {
  const { setAuth, clearAuth, setInitialized, isInitialized, setAccessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (!hasAuthSessionHint()) {
        setInitialized();
        return;
      }

      try {
        const { accessToken } = await authApi.refresh();

        setAccessToken(accessToken);

        const user = await authApi.profile();
        setAuth(user, accessToken);
      } catch {
        clearAuth();
      } finally {
        setInitialized();
      }
    };

    init();
  }, [setAuth, clearAuth, setInitialized, setAccessToken]);

  if (!isInitialized) return <PageLoader />;
  return <>{children}</>;
}
