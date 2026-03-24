import { cn } from '@/shared/lib/utils/cn';

type SpinnerVariant = 'caramel' | 'white';
type SpinnerSize = 'sm' | 'md';

interface SpinnerProps {
  /** `caramel` — for use on light backgrounds (page loader, etc.)
   *  `white`   — for use inside dark/caramel buttons */
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  className?: string;
}

const sizeClass: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-10 h-10',
};

/**
 * The two-color spinning ring uses:
 *   - A base border color (full ring, semi-transparent)
 *   - An override on border-top (the visible "head" of the spinner)
 *
 * Tailwind v4 generates `border-t-*` utilities for all @theme colors,
 * so `border-t-ob-caramel` sets border-top-color: var(--color-ob-caramel).
 * `border-white/30` uses the opacity modifier (color-mix).
 * `border-t-white` sets the top to full opaque white.
 */
const variantClass: Record<SpinnerVariant, string> = {
  // Used inside PageLoader — matches the app's light background
  caramel: 'border-ob-border border-t-ob-caramel',
  // Used inside btn-primary (dark caramel bg) — full white ring
  white: 'border-white/30 border-t-white',
};

export function Spinner({ variant = 'caramel', size = 'sm', className }: SpinnerProps) {
  return <span className={cn('rounded-full border-2 animate-spin shrink-0', sizeClass[size], variantClass[variant], className)} />;
}
