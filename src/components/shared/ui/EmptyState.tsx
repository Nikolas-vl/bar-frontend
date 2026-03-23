import { cn } from '@/utils/cn';

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
  layout?: 'page' | 'inline';
  className?: string;
};

export function EmptyState({
  title = 'No data found',
  description,
  icon = '📂',
  action,
  layout = 'page',
  className,
}: EmptyStateProps) {
  const content = (
    <div className={cn('card p-12 text-center flex flex-col items-center gap-4', className)}>
      <span className="text-4xl" role="img" aria-label="empty">
        {icon}
      </span>
      <div className="space-y-1">
        <h3 className="text-lg font-display font-semibold text-ob-text">{title}</h3>
        {description && <p className="text-sm text-ob-muted max-w-[280px] mx-auto">{description}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
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
