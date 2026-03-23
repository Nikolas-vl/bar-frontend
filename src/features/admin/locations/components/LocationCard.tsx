import type { Location } from '@/types';
import { LocationInfoCard } from '@/features/locations/components/LocationInfoCard';
import { IconEdit, IconTrash } from '@/assets/icons';
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
    <LocationInfoCard
      location={location}
      badge={
        <div className='flex items-center gap-1'>
          <button type='button' onClick={onEdit} className='btn-icon-ghost' aria-label='Edit location'>
            <IconEdit className='w-4 h-4' />
          </button>
          <button type='button' onClick={onDelete} className='btn-icon-ghost text-ob-error' aria-label='Delete location'>
            <IconTrash className='w-4 h-4' />
          </button>
        </div>
      }
      footer={
        <div className='flex items-center justify-between'>
          <span className='badge'>{tableCount} tables</span>
          <label className='flex items-center gap-2 cursor-pointer'>
            <span className='text-xs text-ob-muted'>Active</span>
            <input
              type='checkbox'
              checked={location.isActive}
              onChange={e => onToggleActive(e.target.checked)}
              disabled={isToggling}
              className={cn('accent-ob-caramel w-4 h-4', isToggling && 'cursor-not-allowed')}
            />
          </label>
        </div>
      }
    />
  );
}
