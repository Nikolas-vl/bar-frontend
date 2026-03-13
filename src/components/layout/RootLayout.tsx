import { Outlet } from 'react-router-dom';
import { Header } from './header/Header';
import { Footer } from './Footer';
import { CartDrawer } from '../shared/CartDrawer';

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
