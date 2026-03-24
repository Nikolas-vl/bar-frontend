import { Spinner } from './Spinner';
import { cn } from '@/shared/lib/utils/cn';

type LoadingStateProps = {
  message?: string;
  layout?: 'page' | 'inline';
  className?: string;
};

export function LoadingState({
  message = 'Loading...',
  layout = 'page',
  className,
}: LoadingStateProps) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-8', className)}>
      <Spinner size="md" variant="caramel" />
      <p className="text-sm text-ob-muted animate-pulse">{message}</p>
    </div>
  );

  if (layout === 'inline') {
    return content;
  }

  return (
    <div className="page-container py-12 flex items-center justify-center min-h-[400px]">
      {content}
    </div>
  );
}
