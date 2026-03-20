import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/utils/cn';

const links = [
  { to: '/profile', end: true, label: 'My Profile', icon: '👤' },
  { to: '/profile/addresses', end: false, label: 'Addresses', icon: '📍' },
  { to: '/profile/payments', end: false, label: 'Payment Methods', icon: '💳' },
];

interface ProfileLayoutProps {
  children: ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  const user = useAuthStore(s => s.user);

  return (
    <div className='page-container py-10'>
      <div className='mb-8'>
        <h1 className='font-display text-3xl font-semibold text-ob-text'>Account</h1>
        <p className='text-sm text-ob-muted mt-1'>{user?.email}</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <aside className='md:col-span-1'>
          <nav className='card p-2 flex flex-col gap-0.5'>
            {links.map(({ to, end, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive ? 'bg-ob-caramel/10 text-ob-caramel' : 'text-ob-muted hover:bg-ob-border hover:text-ob-text',
                  )
                }
              >
                <span>{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className='md:col-span-3'>{children}</main>
      </div>
    </div>
  );
}
