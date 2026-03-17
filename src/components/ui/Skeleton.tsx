import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton — reusable loading placeholder.
 *
 * Uses the design token `bg-ob-border` (generated from --color-ob-border)
 * so it automatically tracks theme changes.
 *
 * Usage:
 *   <Skeleton className="h-4 w-3/4" />
 *   <Skeleton className="h-full w-full rounded-2xl" />
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse bg-ob-border rounded-md', className)} />;
}
