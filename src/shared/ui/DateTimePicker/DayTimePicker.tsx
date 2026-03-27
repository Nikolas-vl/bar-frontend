import { useEffect, useMemo, useRef, useState, type ButtonHTMLAttributes } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isValid } from 'date-fns';
import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react-dom';
import { cn } from '@/shared/lib/utils/cn';
import { TimePicker } from './TimePicker';
import { getHoursForDate, generateTimeSlots, isOpenDay } from '@/shared/config/businessHours';
import { useDismissableLayer } from '@/shared/hooks/useDismissableLayer';
import 'react-day-picker/dist/style.css';
import { createPortal } from 'react-dom';

// ─── Types ─────────────────────────────────────────────────────────────────

interface DateTimePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  value: string;
  onChange: (isoString: string) => void;
  minDate?: Date;
  hasError?: boolean;
  placeholder?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function combineDateAndTime(date: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function snapToSlot(timeStr: string, slots: string[]): string {
  if (slots.includes(timeStr)) return timeStr;
  const [h, m] = timeStr.split(':').map(Number);
  const target = h * 60 + m;
  return slots.reduce((best, slot) => {
    const [sh, sm] = slot.split(':').map(Number);
    const sDiff = Math.abs(sh * 60 + sm - target);
    const [bh, bm] = best.split(':').map(Number);
    const bDiff = Math.abs(bh * 60 + bm - target);
    return sDiff < bDiff ? slot : best;
  }, slots[0]);
}

// ─── Component ─────────────────────────────────────────────────────────────

export function DateTimePicker({
  value,
  onChange,
  minDate,
  hasError,
  placeholder = 'Pick a date & time…',
  className,
  ...buttonProps
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dismissRefs = useMemo(() => [buttonRef, panelRef], []);

  const { refs, floatingStyles, update } = useFloating({
    open,
    placement: 'bottom-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableWidth, elements }) {
          elements.floating.style.width = `${Math.min(320, availableWidth)}px`;
        },
      }),
    ],
  });

  const currentDate = value && isValid(new Date(value)) ? new Date(value) : undefined;

  const { from: minTime, to: maxTime } = getHoursForDate(currentDate);
  const slots = generateTimeSlots(minTime, maxTime);

  const [timeStr, setTimeStr] = useState(() => {
    if (currentDate) return snapToSlot(format(currentDate, 'HH:mm'), slots);
    return slots[0] ?? '08:00';
  });

  useDismissableLayer({
    isOpen: open,
    onDismiss: () => setOpen(false),
    refs: dismissRefs,
  });

  useEffect(() => {
    if (!open) return;
    update();
  }, [open, update]);

  const handleToggle = () => {
    setOpen(v => !v);
  };

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;

    const { from, to } = getHoursForDate(day);
    const newSlots = generateTimeSlots(from, to);
    const safeTime = newSlots.includes(timeStr) ? timeStr : snapToSlot(timeStr, newSlots);

    setTimeStr(safeTime);
    onChange(combineDateAndTime(day, safeTime).toISOString());
  };

  const handleTimeChange = (newTime: string) => {
    setTimeStr(newTime);
    if (currentDate) {
      onChange(combineDateAndTime(currentDate, newTime).toISOString());
    }
  };

  const displayValue = currentDate ? `${format(currentDate, 'EEE, MMM d yyyy')} at ${timeStr}` : '';

  const hoursHint = currentDate ? `Open reservation hours ${minTime}-${maxTime}` : 'Mon-Fri 08:00-19:00 · Sat-Sun 08:00-09:30';

  const handleReferenceRef = (node: HTMLButtonElement | null) => {
    buttonRef.current = node;
    refs.setReference(node);
  };

  const handleFloatingRef = (node: HTMLDivElement | null) => {
    panelRef.current = node;
    refs.setFloating(node);
  };

  return (
    <div>
      <button
        {...buttonProps}
        ref={handleReferenceRef}
        type='button'
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup='dialog'
        className={cn(
          'flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm text-left',
          'transition-all duration-200 focus:outline-none cursor-pointer',
          'bg-ob-surface border-[1.5px] border-ob-border',
          'hover:border-ob-border-h',
          'focus:border-ob-caramel focus:shadow-[0_0_0_3px_rgba(197,139,90,0.12)]',
          hasError && 'border-ob-error shadow-[0_0_0_3px_rgba(192,57,43,0.10)]',
          className,
        )}
      >
        <span className={displayValue ? 'text-ob-text' : 'text-ob-light'}>{displayValue || placeholder}</span>
        <span className='text-base shrink-0 ml-2 opacity-60'>📅</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={handleFloatingRef}
            data-dismissable-layer-ignore
            className={cn(
              'z-200',
              'w-[320px] max-w-[calc(100vw-1rem)]',
              'bg-ob-surface border border-ob-border rounded-2xl',
              'shadow-[0_8px_32px_rgba(47,47,47,0.14)]',
              'p-4 flex flex-col gap-4',
            )}
            style={floatingStyles}
          >
            {/* Calendar */}
            <DayPicker
              mode='single'
              selected={currentDate}
              onSelect={handleDaySelect}
              disabled={[
                // Disable past dates
                ...(minDate ? [{ before: minDate }] : []),
                // Disable restaurant closed dates (holidays etc.)
                (day: Date) => !isOpenDay(day),
              ]}
              showOutsideDays
              classNames={{
                root: 'w-full',
                months: 'w-full',
                month: 'w-full',
                month_caption: 'flex justify-between items-center px-1 mb-2',
                caption_label: 'font-display font-semibold text-sm text-ob-text',
                nav: 'flex items-center gap-1',
                button_previous: cn(
                  'w-7 h-7 flex items-center justify-center rounded-lg transition-colors',
                  'text-ob-muted hover:bg-ob-blue hover:text-ob-text focus:outline-none',
                ),
                button_next: cn(
                  'w-7 h-7 flex items-center justify-center rounded-lg transition-colors',
                  'text-ob-muted hover:bg-ob-blue hover:text-ob-text focus:outline-none',
                ),
                month_grid: 'w-full border-collapse',
                weekdays: 'flex',
                weekday: 'text-ob-muted text-[11px] font-semibold w-9 text-center py-1',
                weeks: 'w-full',
                week: 'flex w-full mt-1',
                day: 'w-9 h-9 p-0',
                day_button: cn(
                  'w-9 h-9 flex items-center justify-center rounded-xl',
                  'text-sm font-medium text-ob-text transition-colors cursor-pointer',
                  'hover:bg-ob-blue focus:outline-none',
                ),
                selected: '[&>button]:!bg-ob-caramel [&>button]:!text-white [&>button]:hover:!bg-ob-caramel-h',
                today: '[&>button]:font-bold [&>button]:text-ob-caramel',
                outside: '[&>button]:text-ob-light [&>button]:opacity-40',
                disabled: '[&>button]:opacity-30 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
              }}
            />

            <div className='h-px bg-ob-border' />

            {/* Time row */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-3'>
                <span className='text-xs font-semibold text-ob-muted shrink-0 uppercase tracking-wider'>Time</span>
                <div className='flex-1'>
                  <TimePicker value={timeStr} onChange={handleTimeChange} minTime={minTime} maxTime={maxTime} />
                </div>
              </div>
              <p className='text-[11px] text-ob-muted text-right'>🕐 {hoursHint}</p>
            </div>

            {/* Confirm */}
            <button
              type='button'
              onClick={() => setOpen(false)}
              disabled={!currentDate}
              className='btn-primary w-full justify-center py-2.5 text-sm disabled:opacity-40'
            >
              {currentDate ? `Confirm — ${format(currentDate, 'MMM d')} at ${timeStr}` : 'Select a date first'}
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
