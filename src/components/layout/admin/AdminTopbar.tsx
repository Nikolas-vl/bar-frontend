import { Logo } from '../../ui/Logo';
import { IconMenu } from '../../../assets/icons';

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  return (
    <div
      className='lg:hidden flex items-center justify-between h-14 px-4 shrink-0'
      style={{
        backgroundColor: 'var(--color-ob-surface)',
        borderBottom: '1px solid var(--color-ob-border)',
      }}
    >
      <div className='flex items-center gap-3'>
        <button onClick={onToggleSidebar} className='btn-icon-ghost' aria-label='Toggle menu'>
          <IconMenu width={20} height={20} />
        </button>
        <Logo size='sm' />
      </div>

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
