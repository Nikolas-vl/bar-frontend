import { Skeleton } from '@/components/shared/ui';

export function DishDetailSkeleton() {
  return (
    <div className='page-container py-10'>
      <div className='max-w-3xl mx-auto flex flex-col gap-6'>
        <Skeleton className='w-full aspect-video rounded-2xl' />
        <Skeleton className='h-8 rounded-lg w-2/3' />
        <Skeleton className='h-4 rounded-lg w-full' />
        <Skeleton className='h-4 rounded-lg w-4/5' />
        <div className='grid grid-cols-4 gap-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-16 rounded-xl' />
          ))}
        </div>
      </div>
    </div>
  );
}
