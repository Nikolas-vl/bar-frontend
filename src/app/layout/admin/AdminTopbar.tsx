import { Logo } from '@/shared/ui';
import { IconMenu } from '@/shared/assets/icons';
import { Link } from 'react-router-dom';

interface AdminTopbarProps {
  onOpenMenu: () => void;
}

export function AdminTopbar({ onOpenMenu }: AdminTopbarProps) {
  return (
    <div className='lg:hidden flex items-center justify-between h-16 px-4 shrink-0 bg-ob-surface border-b border-ob-border'>
      <Link to='/'>
        <Logo size='sm' />
      </Link>

      <span className='px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[rgba(197,139,90,0.10)] text-ob-caramel'>
        <Link to='/admin'>Admin</Link>
      </span>

      <button onClick={onOpenMenu} className='btn-icon-ghost' aria-label='Open menu'>
        <IconMenu width={20} height={20} />
      </button>
    </div>
  );
}
