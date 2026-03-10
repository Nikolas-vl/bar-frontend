import { Logo } from '../ui/Logo';

export function AdminTopbar() {
  return (
    <div
      className='lg:hidden flex items-center justify-between h-14 px-4'
      style={{
        backgroundColor: 'var(--color-ob-surface)',
        borderBottom: '1px solid var(--color-ob-border)',
      }}
    >
      <Logo size='sm' />

      <span
        className='px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider'
        style={{
          background: 'rgba(197,139,90,0.10)',
          color: 'var(--color-ob-caramel)',
        }}
      >
        Admin
      </span>
    </div>
  );
}
