import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/app/store/auth.store';
import { authApi } from '@/shared/lib/api/auth.api';
import { Spinner } from '@/shared/ui';

type CallbackStatus = 'processing' | 'success' | 'error';

interface CallbackResult {
  status: CallbackStatus;
  errorMessage: string;
}

function parseCallbackParams(params: URLSearchParams): CallbackResult {
  const error = params.get('error');
  const accessToken = params.get('accessToken');

  if (error || !accessToken) {
    return {
      status: 'error',
      errorMessage:
        error === 'google_auth_failed' ? 'Google authentication failed. Please try again.' : 'Authentication failed. Missing credentials.',
    };
  }

  return { status: 'processing', errorMessage: '' };
}

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const parsed = parseCallbackParams(searchParams);
  const [status, setStatus] = useState<CallbackStatus>(parsed.status);
  const [errorMessage, setErrorMessage] = useState(parsed.errorMessage);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current || status !== 'processing') return;
    didRun.current = true;

    const accessToken = searchParams.get('accessToken')!;

    const completeAuth = async () => {
      try {
        useAuthStore.getState().setAccessToken(accessToken);

        const user = await authApi.profile();

        setAuth(user, accessToken);
        toast.success(`Welcome${user.name ? `, ${user.name}` : ''}! ☕`);
        navigate(user.role === 'ADMIN' ? '/admin' : '/', { replace: true });
      } catch {
        useAuthStore.getState().clearAuth();
        setStatus('error');
        setErrorMessage('Failed to complete authentication. Please try again.');
      }
    };

    completeAuth();
  }, [searchParams, navigate, setAuth, status]);

  if (status === 'error') {
    return (
      <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-ob-bg'>
        <div className='w-full max-w-sm animate-slide-up text-center'>
          <div className='w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-red-50 border border-red-100'>
            <span className='text-2xl'>✕</span>
          </div>
          <h1 className='font-display text-2xl font-semibold mb-2 text-ob-text'>Authentication failed</h1>
          <p className='text-sm text-ob-muted mb-6'>{errorMessage}</p>
          <button onClick={() => navigate('/login', { replace: true })} className='btn-primary w-full justify-center'>
            Back to Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-ob-bg'>
      <div className='w-full max-w-sm text-center animate-slide-up'>
        <div className='w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-ob-blue'>
          <Spinner variant='caramel' size='md' />
        </div>
        <h1 className='font-display text-2xl font-semibold mb-2 text-ob-text'>Signing you in…</h1>
        <p className='text-sm text-ob-muted'>Completing Google authentication</p>
      </div>
    </div>
  );
}
