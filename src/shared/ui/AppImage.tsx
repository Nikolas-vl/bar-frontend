import { useMemo, useState } from 'react';
import { cn } from '@/shared/lib/utils/cn';

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
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
}

interface ImageRendererProps {
  source?: string;
  originalSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  loading: 'lazy' | 'eager';
  fetchPriority: 'high' | 'low' | 'auto';
  sizes?: string;
  hoverScale: boolean;
  imgClassName?: string;
  fallbackIcon: string;
  showLabel: boolean;
}

const ASPECT_CLASS: Record<AspectRatio, string> = {
  '4/3': 'aspect-[4/3]',
  video: 'aspect-video',
  square: 'aspect-square',
  '3/2': 'aspect-[3/2]',
  auto: '',
};

const ASPECT_DIMENSIONS: Partial<Record<AspectRatio, { width: number; height: number }>> = {
  '4/3': { width: 960, height: 720 },
  video: { width: 1280, height: 720 },
  square: { width: 720, height: 720 },
  '3/2': { width: 960, height: 640 },
};

const DEFAULT_SIZES: Partial<Record<AspectRatio, string>> = {
  '4/3': '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  video: '(min-width: 1024px) 66vw, 100vw',
  square: '(min-width: 1024px) 96px, (min-width: 640px) 88px, 80px',
  '3/2': '(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw',
};

function optimizeImageUrl(src: string, width: number) {
  try {
    const url = new URL(src);
    const host = url.hostname;

    if (host.includes('res.cloudinary.com') && url.pathname.includes('/upload/')) {
      url.pathname = url.pathname.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
      return url.toString();
    }

    if (host.includes('images.unsplash.com')) {
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'max');
      url.searchParams.set('q', '72');
      url.searchParams.set('w', String(width));
      return url.toString();
    }

    if (host.includes('ik.imagekit.io')) {
      url.searchParams.set('tr', `f-auto,q-72,w-${width}`);
      return url.toString();
    }

    if (host.includes('imgix.net')) {
      url.searchParams.set('auto', 'format,compress');
      url.searchParams.set('fit', 'max');
      url.searchParams.set('q', '72');
      url.searchParams.set('w', String(width));
      return url.toString();
    }
  } catch {
    return src;
  }

  return src;
}

function ImageRenderer({
  source,
  originalSrc,
  alt,
  width,
  height,
  loading,
  fetchPriority,
  sizes,
  hoverScale,
  imgClassName,
  fallbackIcon,
  showLabel,
}: ImageRendererProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(source);
  const [didFallbackToOriginal, setDidFallbackToOriginal] = useState(false);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(source ? 'loading' : 'error');

  const handleError = () => {
    if (!didFallbackToOriginal && originalSrc && currentSrc !== originalSrc) {
      setDidFallbackToOriginal(true);
      setCurrentSrc(originalSrc);
      return;
    }

    setStatus('error');
  };

  return (
    <>
      {status === 'loading' && <div className='absolute inset-0 animate-pulse bg-ob-border/60' />}

      {currentSrc && status !== 'error' && (
        <img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={loading === 'eager' ? 'sync' : 'async'}
          sizes={sizes}
          onLoad={() => setStatus('loaded')}
          onError={handleError}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-all duration-300',
            hoverScale && 'group-hover:scale-105',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}

      {status === 'error' && (
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ob-blue/30'>
          <span className='text-2xl select-none font-semibold'>{fallbackIcon}</span>
          {showLabel && <span className='text-[10px] font-medium uppercase tracking-widest text-ob-muted'>No image</span>}
        </div>
      )}
    </>
  );
}

export function AppImage({
  src,
  alt,
  aspectRatio = '4/3',
  fallbackIcon = '🍽️',
  showLabel = false,
  className,
  imgClassName,
  hoverScale = false,
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes,
}: AppImageProps) {
  const dimensions = ASPECT_DIMENSIONS[aspectRatio];

  const optimizedSrc = useMemo(() => {
    if (!src || !dimensions) return src ?? undefined;
    return optimizeImageUrl(src, dimensions.width);
  }, [src, dimensions]);

  const renderKey = `${src ?? 'empty'}|${optimizedSrc ?? 'empty'}`;

  return (
    <div className={cn('relative w-full overflow-hidden bg-ob-surface', ASPECT_CLASS[aspectRatio], className)}>
      <ImageRenderer
        key={renderKey}
        source={optimizedSrc}
        originalSrc={src ?? undefined}
        alt={alt}
        width={dimensions?.width}
        height={dimensions?.height}
        loading={loading}
        fetchPriority={fetchPriority}
        sizes={sizes ?? DEFAULT_SIZES[aspectRatio]}
        hoverScale={hoverScale}
        imgClassName={imgClassName}
        fallbackIcon={fallbackIcon}
        showLabel={showLabel}
      />
    </div>
  );
}
