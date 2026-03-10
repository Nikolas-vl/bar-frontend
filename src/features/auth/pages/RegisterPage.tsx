import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authApi } from '../../../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';
import { getErrorMessage } from '../../../api/client';
import { cn } from '../../../utils/cn';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const { accessToken, user } = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(user, accessToken);
      toast.success(`Welcome to Jolie, ${user.name}!`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12' style={{ backgroundColor: 'var(--color-ob-bg)' }}>
      <div className='w-full max-w-sm animate-slide-up'>
        <div className='text-center mb-8'>
          <div className='w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4' style={{ backgroundColor: 'var(--color-ob-blue)' }}>
            <span className='text-2xl'>🍽️</span>
          </div>
          <h1 className='font-display text-3xl font-semibold mb-2' style={{ color: 'var(--color-ob-text)' }}>
            Create account
          </h1>
          <p className='text-sm' style={{ color: 'var(--color-ob-text-muted)' }}>
            Join OceanBar and start ordering
          </p>
        </div>

        <div className='card p-7'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <div>
              <label className='label'>Full name</label>
              <input {...register('name')} placeholder='Your name' className={cn('input', errors.name && 'input-error')} autoComplete='name' />
              {errors.name && <p className='field-error'>{errors.name.message}</p>}
            </div>

            <div>
              <label className='label'>Email address</label>
              <input
                {...register('email')}
                type='email'
                placeholder='you@example.com'
                className={cn('input', errors.email && 'input-error')}
                autoComplete='email'
              />
              {errors.email && <p className='field-error'>{errors.email.message}</p>}
            </div>

            <div>
              <label className='label'>Password</label>
              <input
                {...register('password')}
                type='password'
                placeholder='At least 6 characters'
                className={cn('input', errors.password && 'input-error')}
                autoComplete='new-password'
              />
              {errors.password && <p className='field-error'>{errors.password.message}</p>}
            </div>

            <div>
              <label className='label'>Confirm password</label>
              <input
                {...register('confirmPassword')}
                type='password'
                placeholder='Repeat your password'
                className={cn('input', errors.confirmPassword && 'input-error')}
                autoComplete='new-password'
              />
              {errors.confirmPassword && <p className='field-error'>{errors.confirmPassword.message}</p>}
            </div>

            <button type='submit' disabled={isSubmitting} className='btn-primary w-full mt-1 justify-center'>
              {isSubmitting ? (
                <span className='flex items-center gap-2'>
                  <span
                    className='w-4 h-4 rounded-full border-2 animate-spin'
                    style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                  />
                  Creating account…
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className='mt-6 text-center text-sm' style={{ color: 'var(--color-ob-text-muted)' }}>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium transition-colors'
            style={{ color: 'var(--color-ob-caramel)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-ob-wood)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ob-caramel)')}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
