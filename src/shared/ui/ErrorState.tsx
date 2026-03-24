import { cn } from '@/shared/lib/utils/cn';

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  layout?: 'page' | 'inline';
  className?: string;
};

/**
 * Reusable component for displaying error states across the application.
 * Supports full-page and inline layouts.
 */
export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  layout = 'page',
  className,
}: ErrorStateProps) {
  const content = (
    <div className={cn('card p-8 text-center space-y-4', layout === 'inline' && 'p-6', className)}>
      <div className="space-y-2">
        <p className="text-ob-error font-semibold font-display">{title}</p>
        {description && <p className="text-sm text-ob-muted">{description}</p>}
      </div>
      {onRetry && (
        <button type="button" className="btn-primary" onClick={onRetry}>
          Retry
        </button>
      )}
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
