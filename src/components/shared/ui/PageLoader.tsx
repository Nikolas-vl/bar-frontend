import { Spinner } from './Spinner';

export const PageLoader = () => (
  <div className='page-loader'>
    <div className='flex flex-col items-center gap-4'>
      <Spinner variant='caramel' size='md' />
      <span className='text-sm font-medium font-display italic text-ob-muted'>Loading…</span>
    </div>
  </div>
);
