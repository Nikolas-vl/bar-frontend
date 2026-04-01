import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className='mt-16 border-t border-ob-border bg-ob-surface'>
    <div className='page-container py-8'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <Link to='/'>
          <span className='text-gradient font-display text-lg font-semibold'>Jolie Brasserie Café</span>
        </Link>
        <p className='text-sm text-ob-muted'>© {new Date().getFullYear()} Jolie Brasserie Café · All rights reserved</p>
      </div>
    </div>
  </footer>
);
