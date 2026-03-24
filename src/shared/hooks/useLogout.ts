import { toast } from 'sonner';
import { authApi } from '@/shared/lib/api/auth.api';
import { useAuthStore } from '@/app/store/auth.store';
import { useNavigate } from 'react-router-dom';

export function useLogout(message = 'See you soon! ☕') {
  const clearAuth = useAuthStore(s => s.clearAuth);
  const navigate = useNavigate();

  return async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
      toast.success(message);
    }
  };
}
