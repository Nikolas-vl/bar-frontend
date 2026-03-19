import { useEffect } from 'react';
import { Select } from '@/components/shared/ui/Select';
import { getAvailableHours, getAvailableMinutes } from '@/config/businessHours';

interface TimePickerProps {
  value: string; // "HH:mm"
  onChange: (value: string) => void;
  minTime?: string; // "08:00"
  maxTime?: string; // "19:00"
}

export function TimePicker({ value, onChange, minTime = '00:00', maxTime = '23:30' }: TimePickerProps) {
  const [h = '12', m = '00'] = value.split(':');

  const hours = getAvailableHours(minTime, maxTime);
  const minutes = getAvailableMinutes(h, minTime, maxTime);

  // Fix 1: auto-correct hour if it falls outside the new range
  useEffect(() => {
    if (!hours.find(x => x.value === h)) {
      const nextH = hours[0]?.value;
      if (!nextH) return;
      const nextMins = getAvailableMinutes(nextH, minTime, maxTime);
      const nextM = nextMins[0]?.value ?? '00';
      onChange(`${nextH}:${nextM}`);
    }
    // deps: the derived `hours` array changes when minTime/maxTime change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minTime, maxTime]);

  // Fix 2: auto-correct minute when hour changes or range changes
  useEffect(() => {
    if (!minutes.find(x => x.value === m)) {
      const next = minutes[0]?.value;
      if (next) onChange(`${h}:${next}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h, m, minTime, maxTime]);

  const handleHourChange = (newH: string) => {
    // Inline snap: adjust minute immediately so we never emit an invalid combo
    const newMinutes = getAvailableMinutes(newH, minTime, maxTime);
    const newM = newMinutes.find(x => x.value === m) ? m : (newMinutes[0]?.value ?? '00');
    onChange(`${newH}:${newM}`);
  };

  return (
    <div className='flex items-center gap-2'>
      <div className='flex-1'>
        <Select value={h} onChange={handleHourChange} options={hours} placeholder='HH' />
      </div>

      <span className='text-sm font-semibold text-ob-muted shrink-0'>:</span>

      <div className='w-24 shrink-0'>
        <Select value={m} onChange={newM => onChange(`${h}:${newM}`)} options={minutes} placeholder='MM' />
      </div>
    </div>
  );
}
