import { cn } from '../../../utils/cn';

interface NutritionStatProps {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}

export function NutritionStat({ label, value, unit, highlight }: NutritionStatProps) {
  return (
    <div className='flex flex-col items-center gap-0.5 p-3 rounded-xl text-center bg-ob-bg'>
      <span className={cn('font-display font-bold text-xl', highlight ? 'text-ob-caramel' : 'text-ob-text')}>
        {Math.round(value)}
        <span className='text-sm font-normal ml-0.5'>{unit}</span>
      </span>
      <span className='text-xs text-ob-muted'>{label}</span>
    </div>
  );
}
