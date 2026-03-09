export const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center bg-dark-900'>
    <div className='flex flex-col items-center gap-4'>
      <div className='w-10 h-10 rounded-full border-2 border-ocean-500/20 border-t-ocean-500 animate-spin' />
      <p className='text-sm text-slate-500 font-body'>Loading…</p>
    </div>
  </div>
);
