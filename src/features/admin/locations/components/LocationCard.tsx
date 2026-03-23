import type { Location } from '@/types';
import { IconEdit, IconTrash, IconLocation, IconPhone, IconMail, IconClock } from '@/assets/icons';
import { cn } from '@/utils/cn';

interface LocationCardProps {
  location: Location;
  tableCount?: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: (isActive: boolean) => void;
  isToggling?: boolean;
}

export function LocationCard({ location, tableCount = 0, onEdit, onDelete, onToggleActive, isToggling }: LocationCardProps) {
  return (
    <div className={cn('card p-6 space-y-4 transition-opacity', !location.isActive && 'opacity-60')}>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-lg font-display font-semibold text-ob-text'>{location.name}</h3>
          <span className={cn('badge mt-1', location.isActive ? 'badge-confirmed' : 'badge-canceled')}>
            {location.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className='flex items-center gap-1'>
          <button type='button' onClick={onEdit} className='btn-icon-ghost' aria-label='Edit location'>
            <IconEdit className='w-4 h-4' />
          </button>
          <button type='button' onClick={onDelete} className='btn-icon-ghost text-ob-error' aria-label='Delete location'>
            <IconTrash className='w-4 h-4' />
          </button>
        </div>
      </div>

      <div className='space-y-2 text-sm text-ob-muted'>
        <div className='flex items-center gap-2'>
          <IconLocation className='w-4 h-4 shrink-0' />
          <span>{location.address}</span>
        </div>
        <div className='flex items-center gap-2'>
          <IconPhone className='w-4 h-4 shrink-0' />
          <span>{location.phone}</span>
        </div>
        <div className='flex items-center gap-2'>
          <IconMail className='w-4 h-4 shrink-0' />
          <span>{location.email}</span>
        </div>
        <div className='flex items-center gap-2'>
          <IconClock className='w-4 h-4 shrink-0' />
          <span>{location.openingHours}</span>
        </div>
      </div>

      <div className='flex items-center justify-between pt-2 border-t border-ob-border'>
        <span className='badge'>{tableCount} tables</span>
        <label className='flex items-center gap-2 cursor-pointer'>
          <span className='text-xs text-ob-muted'>Active</span>
          <input
            type='checkbox'
            checked={location.isActive}
            onChange={e => onToggleActive(e.target.checked)}
            disabled={isToggling}
            className='accent-ob-caramel w-4 h-4'
          />
        </label>
      </div>
    </div>
  );
}
