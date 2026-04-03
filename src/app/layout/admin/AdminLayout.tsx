import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLogout } from '@/shared/hooks/useLogout';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AdminMobileMenu } from './AdminMobileMenu';
import { useAdminOrderSocket } from '@/admin/features/orders/hooks/useAdminOrderSocket';
import { useReservationSocket } from '@/features/reservations/hooks/useReservationSocket';

export const AdminLayout = () => {
  const handleLogout = useLogout('Logged out');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  useAdminOrderSocket();
  useReservationSocket();
  return (
    <div className='min-h-screen flex bg-ob-bg'>
      <AdminSidebar onLogout={handleLogout} />

      <div className='flex-1 flex flex-col min-w-0'>
        <AdminTopbar onOpenMenu={() => setMobileMenuOpen(true)} />

        <main className='flex-1 p-5 lg:p-8 overflow-y-auto'>
          <Outlet />
        </main>
      </div>

      {isMobileMenuOpen && <AdminMobileMenu onClose={() => setMobileMenuOpen(false)} onLogout={handleLogout} />}
    </div>
  );
};
