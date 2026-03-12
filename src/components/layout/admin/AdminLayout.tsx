import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AdminMobileMenu } from './AdminMobileMenu';

export const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='min-h-screen flex' style={{ backgroundColor: 'var(--color-ob-bg)' }}>
      <AdminSidebar />

      <div className='flex-1 flex flex-col min-w-0'>
        <AdminTopbar onToggleSidebar={() => setIsMobileMenuOpen(true)} />

        <main className='flex-1 p-5 lg:p-8 overflow-y-auto'>
          <Outlet />
        </main>
      </div>

      {isMobileMenuOpen && <AdminMobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
    </div>
  );
};
