import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import { toast } from 'sonner';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/reservations', label: 'Reservations' },
  { to: '/admin/dishes', label: 'Dishes' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/tables', label: 'Tables' },
  { to: '/admin/locations', label: 'Locations' },
  { to: '/admin/settings', label: 'Settings' },
];

export const AdminLayout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
      toast.success('Logged out');
    }
  };

  return (
    <div className='min-h-screen bg-dark-900 flex'>
      {/* Sidebar */}
      <aside className='hidden lg:flex w-56 flex-col border-r border-white/8 bg-dark-800'>
        <div className='h-16 flex items-center px-6 border-b border-white/8'>
          <span className='font-display text-lg font-semibold text-gradient'>OceanBar</span>
          <span className='ml-2 text-2xs font-body text-slate-500 uppercase tracking-widest'>Admin</span>
        </div>

        <nav className='flex-1 px-3 py-4 flex flex-col gap-0.5'>
          {sidebarLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 text-sm font-body rounded-lg transition-colors',
                  isActive ? 'bg-ocean-500/10 text-ocean-400 font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className='px-3 py-4 border-t border-white/8'>
          <button onClick={handleLogout} className='w-full btn-ghost text-sm justify-start'>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className='flex-1 flex flex-col min-w-0'>
        <main className='flex-1 p-6 lg:p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
