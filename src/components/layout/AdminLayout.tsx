import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

export const AdminLayout = () => {
  return (
    <div className='min-h-screen flex' style={{ backgroundColor: 'var(--color-ob-bg)' }}>
      <AdminSidebar />

      <div className='flex-1 flex flex-col min-w-0'>
        <AdminTopbar />

        <main className='flex-1 p-5 lg:p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
