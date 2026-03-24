import { format } from 'date-fns';

export type DayType = 'weekday' | 'weekend';

export interface HoursRange {
  from: string;
  to: string;
}

export const BUSINESS_HOURS: Record<DayType, HoursRange> = {
  weekday: { from: '08:00', to: '19:00' },
  weekend: { from: '08:00', to: '09:30' },
};

const CLOSED_DATES: ReadonlySet<string> = new Set(['2026-12-25', '2026-12-26', '2027-01-01']);

export function isOpenDay(date: Date): boolean {
  return !CLOSED_DATES.has(format(date, 'yyyy-MM-dd'));
}

export function getHoursForDate(date: Date | undefined): HoursRange {
  if (!date) return BUSINESS_HOURS.weekday;
  const day = date.getDay();
  return day === 0 || day === 6 ? BUSINESS_HOURS.weekend : BUSINESS_HOURS.weekday;
}

// ─── Slot helpers ──────────────────────────────────────────────────────────

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function generateTimeSlots(min: string, max: string): string[] {
  const minM = toMinutes(min);
  const maxM = toMinutes(max);
  const slots: string[] = [];

  for (let h = 0; h < 24; h++) {
    for (const frac of [0, 30]) {
      const total = h * 60 + frac;
      if (total >= minM && total <= maxM) {
        slots.push(`${String(h).padStart(2, '0')}:${String(frac).padStart(2, '0')}`);
      }
    }
  }
  return slots;
}

export function getAvailableHours(min: string, max: string): { value: string; label: string }[] {
  const slots = generateTimeSlots(min, max);
  const seen = new Set<string>();
  return slots
    .map(s => s.split(':')[0])
    .filter(h => {
      if (seen.has(h)) return false;
      seen.add(h);
      return true;
    })
    .map(h => ({ value: h, label: h }));
}

export function getAvailableMinutes(hour: string, min: string, max: string): { value: string; label: string }[] {
  const minM = toMinutes(min);
  const maxM = toMinutes(max);
  return ['00', '30']
    .filter(m => {
      const total = Number(hour) * 60 + Number(m);
      return total >= minM && total <= maxM;
    })
    .map(m => ({ value: m, label: m }));
}
