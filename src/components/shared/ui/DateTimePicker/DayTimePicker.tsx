import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isValid } from 'date-fns';
import { cn } from '@/utils/cn';
import { TimePicker } from './TimePicker';
import { getHoursForDate, generateTimeSlots, isOpenDay } from '@/config/businessHours';
import 'react-day-picker/dist/style.css';
import { createPortal } from 'react-dom';

// ─── Types ─────────────────────────────────────────────────────────────────

interface DateTimePickerProps {
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

export function DateTimePicker({ value, onChange, minDate, hasError, placeholder = 'Pick a date & time…' }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const currentDate = value && isValid(new Date(value)) ? new Date(value) : undefined;

  const { from: minTime, to: maxTime } = getHoursForDate(currentDate);
  const slots = generateTimeSlots(minTime, maxTime);

  const [timeStr, setTimeStr] = useState(() => {
    if (currentDate) return snapToSlot(format(currentDate, 'HH:mm'), slots);
    return slots[0] ?? '08:00';
  });

  // Outside-click: close panel unless the click landed inside a Radix portal.
  // Radix Select/Popover content is rendered in a portal on document.body, which means
  // it is NOT a descendant of containerRef — without this guard every Select click
  // would immediately close the DateTimePicker.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (buttonRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      if (target.closest('[data-radix-popper-content-wrapper]')) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      setAnchorRect(buttonRef.current.getBoundingClientRect());
    }
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

  return (
    <div>
      <button
        ref={buttonRef}
        type='button'
        onClick={handleToggle}
        className={cn(
          'flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm text-left',
          'transition-all duration-200 focus:outline-none cursor-pointer',
          'bg-ob-surface border-[1.5px] border-ob-border',
          'hover:border-ob-border-h',
          'focus:border-ob-caramel focus:shadow-[0_0_0_3px_rgba(197,139,90,0.12)]',
          hasError && 'border-ob-error shadow-[0_0_0_3px_rgba(192,57,43,0.10)]',
        )}
      >
        <span className={displayValue ? 'text-ob-text' : 'text-ob-light'}>{displayValue || placeholder}</span>
        <span className='text-base shrink-0 ml-2 opacity-60'>📅</span>
      </button>

      {open &&
        anchorRect &&
        createPortal(
          <div
            ref={panelRef}
            className={cn(
              'fixed z-200',
              'w-[320px]',
              'bg-ob-surface border border-ob-border rounded-2xl',
              'shadow-[0_8px_32px_rgba(47,47,47,0.14)]',
              'p-4 flex flex-col gap-4',
            )}
            style={{
              top: anchorRect.bottom + 6,
              left: Math.min(anchorRect.left, window.innerWidth - 332),
            }}
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
