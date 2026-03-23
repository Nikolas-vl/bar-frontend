import { Select, type SelectOption } from '@/components/shared/ui';
import { Spinner } from '@/components/shared/ui';

interface StatusSelectProps {
  current: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  isPending?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function StatusSelect({ current, options, onChange, isPending = false, disabled, className, placeholder }: StatusSelectProps) {
  return (
    <div className='inline-flex items-center gap-2'>
      <Select
        value={current}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        disabled={disabled || isPending}
        className={className}
      />
      {isPending && <Spinner variant='caramel' size='sm' />}
    </div>
  );
}
