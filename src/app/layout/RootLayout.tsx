import { Outlet } from 'react-router-dom';
import { Header } from './site/Header/Header';
import { Footer } from './site/Footer';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { useOrderSocket } from '@/features/orders/hooks/useOrderSocket';
import { useReservationSocket } from '@/features/reservations/hooks/useReservationSocket';

export const RootLayout = () => {
  useOrderSocket();
  useReservationSocket();
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
