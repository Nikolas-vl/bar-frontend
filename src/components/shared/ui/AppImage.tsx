import { useState } from 'react';
import { cn } from '@/utils/cn';

type AspectRatio = '4/3' | 'video' | 'square' | '3/2' | 'auto';

interface AppImageProps {
  src?: string | null;
  alt: string;
  aspectRatio?: AspectRatio;
  /** Emoji shown when no image or image fails to load. Defaults to '🍽️' */
  fallbackIcon?: string;
  /**
   * Whether to show the "No image" text label below the fallback icon.
   * Disable for small thumbnails where the label doesn't fit.
   * @default false
   */
  showLabel?: boolean;
  className?: string;
  imgClassName?: string;
  /** Extra scale on hover — useful inside interactive cards */
  hoverScale?: boolean;
}

const ASPECT_CLASS: Record<AspectRatio, string> = {
  '4/3': 'aspect-[4/3]',
  video: 'aspect-video',
  square: 'aspect-square',
  '3/2': 'aspect-[3/2]',
  auto: '',
};

export function AppImage({
  src,
  alt,
  aspectRatio = '4/3',
  fallbackIcon = '🍽️',
  showLabel = false,
  className,
  imgClassName,
  hoverScale = false,
}: AppImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

  return (
    <div className={cn('relative w-full overflow-hidden bg-ob-surface', ASPECT_CLASS[aspectRatio], className)}>
      {/* Skeleton */}
      {status === 'loading' && <div className='absolute inset-0 animate-pulse bg-ob-border/60' />}

      {/* Image */}
      {src && status !== 'error' && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-all duration-300',
            hoverScale && 'group-hover:scale-105',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}

      {/* Fallback */}
      {status === 'error' && (
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ob-blue/30'>
          <span className='text-4xl select-none'>{fallbackIcon}</span>
          {showLabel && <span className='text-[10px] font-medium uppercase tracking-widest text-ob-muted'>No image</span>}
        </div>
      )}
    </div>
  );
}
