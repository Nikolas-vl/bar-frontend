import type { ReactNode } from 'react';
import type { Location } from '@/types';
import { IconLocation, IconPhone, IconMail, IconClock } from '@/assets/icons';
import { cn } from '@/utils/cn';

interface LocationInfoCardProps {
  location: Location;
  footer?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function LocationInfoCard({ location, footer, badge, className }: LocationInfoCardProps) {
  const defaultBadge = (
    <span className={cn('badge', location.isActive ? 'badge-confirmed' : 'badge-canceled')}>{location.isActive ? 'Open' : 'Closed'}</span>
  );

  return (
    <div className={cn('card p-6 flex flex-col gap-4', !location.isActive && 'opacity-60', className)}>
      <div className='flex items-start justify-between gap-2'>
        <h3 className='font-display font-semibold text-lg text-ob-text'>{location.name}</h3>
        {badge ?? defaultBadge}
      </div>
      <div className='space-y-2 text-sm text-ob-muted'>
        <div className='flex items-center gap-2'>
          <IconLocation className='w-4 h-4 shrink-0' />
          <a href={mapsUrl(location.address)} target='_blank' rel='noopener noreferrer' className='hover:text-ob-text transition-colors'>
            {location.address}
          </a>
        </div>
        <div className='flex items-center gap-2'>
          <IconPhone className='w-4 h-4 shrink-0' />
          <a href={`tel:${location.phone}`} className='hover:text-ob-text transition-colors'>
            {location.phone}
          </a>
        </div>
        <div className='flex items-center gap-2'>
          <IconMail className='w-4 h-4 shrink-0' />
          <a href={`mailto:${location.email}`} className='hover:text-ob-text transition-colors'>
            {location.email}
          </a>
        </div>
        <div className='flex items-center gap-2'>
          <IconClock className='w-4 h-4 shrink-0' />
          <span>{location.openingHours}</span>
        </div>
      </div>
      {footer && <div className='pt-2 border-t border-ob-border'>{footer}</div>}
    </div>
  );
}
