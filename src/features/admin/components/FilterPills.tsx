import { cn } from '@/utils/cn';

interface FilterPillsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelMap?: Partial<Record<T, string>>;
  className?: string;
}

export function FilterPills<T extends string>({ options, value, onChange, labelMap, className }: FilterPillsProps<T>) {
  return (
    <div className={cn('flex gap-1', className)}>
      {options.map(option => (
        <button
          key={option}
          type='button'
          onClick={() => onChange(option)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
            value === option ? 'bg-ob-caramel text-white' : 'bg-ob-blue text-ob-text hover:bg-ob-border',
          )}
        >
          {labelMap?.[option] ?? option}
        </button>
      ))}
    </div>
  );
}
