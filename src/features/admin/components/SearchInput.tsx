import { IconSearch, IconClose } from '@/assets/icons';
import { cn } from '@/utils/cn';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <IconSearch className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ob-muted pointer-events-none' />
      <input
        type='text'
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className='input pl-10 pr-9'
        aria-label={placeholder}
      />
      {value && (
        <button
          type='button'
          onClick={() => onChange('')}
          className='absolute right-2 top-1/2 -translate-y-1/2 btn-icon-ghost w-6 h-6 p-0'
          aria-label='Clear search'
        >
          <IconClose className='w-3.5 h-3.5' />
        </button>
      )}
    </div>
  );
}
