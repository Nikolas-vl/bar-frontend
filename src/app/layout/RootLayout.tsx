import { Outlet } from 'react-router-dom';
import { Header } from './site/Header/Header';
import { Footer } from './site/Footer';
import { CartDrawer } from '@/features/cart/components/CartDrawer';

export const RootLayout = () => {
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
