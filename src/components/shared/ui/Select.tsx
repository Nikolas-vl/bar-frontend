import * as RadixSelect from '@radix-ui/react-select';
import { cn } from '@/utils/cn';
import { IconChevronDown, IconCheck } from '@/assets/icons';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({ value, onChange, options, placeholder = 'Select…', disabled, className }: SelectProps) {
  const selected = options.find(o => o.value === value);

  return (
    <RadixSelect.Root value={value} onValueChange={onChange} disabled={disabled}>
      <RadixSelect.Trigger
        className={cn(
          'group',
          'flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm',
          'transition-all duration-200 focus:outline-none cursor-pointer',
          'bg-ob-surface border-[1.5px] border-ob-border text-ob-text',
          'hover:border-ob-border-h',
          'focus:border-ob-caramel focus:shadow-[0_0_0_3px_rgba(197,139,90,0.12)]',
          'data-placeholder:text-ob-light',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder}>{selected?.label}</RadixSelect.Value>
        <RadixSelect.Icon asChild>
          {/* ✅ group-data-[state=open] now works because parent has `group` */}
          <IconChevronDown className='w-4 h-4 text-ob-muted shrink-0 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position='popper'
          sideOffset={6}
          className={cn(
            'z-50 overflow-hidden',
            'w-(--radix-select-trigger-width)',
            'bg-ob-surface border border-ob-border rounded-xl',
            'shadow-[0_8px_24px_rgba(47,47,47,0.12)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
            'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2',
          )}
        >
          <RadixSelect.Viewport className='p-1.5 max-h-60 overflow-y-auto'>
            {options.map(option => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className={cn(
                  'relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm',
                  'text-ob-text cursor-pointer select-none outline-none',
                  'transition-colors duration-100',
                  'data-highlighted:bg-ob-blue data-highlighted:text-ob-text',
                  'data-[state=checked]:font-medium data-[state=checked]:text-ob-caramel',
                )}
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator>
                  <IconCheck className='w-4 h-4 text-ob-caramel' />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
