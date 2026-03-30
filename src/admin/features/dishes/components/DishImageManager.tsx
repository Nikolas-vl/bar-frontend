import { useRef, useState } from 'react';
import { AppImage } from '@/shared/ui';
import { Spinner } from '@/shared/ui/Spinner';
import { useUploadDishImage, useDeleteDishImage } from '../hooks/useManageDishImage';
import { cn } from '@/shared/lib/utils/cn';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';

interface DishImageManagerProps {
  dishId: number;
  imageUrl: string | null;
  imageId: string | null;
  dishName: string;
}

const ACCEPTED = 'image/jpeg,image/png,image/webp';
const MAX_BYTES = 5 * 1024 * 1024;

export function DishImageManager({ dishId, imageUrl, dishName }: DishImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const uploadMutation = useUploadDishImage();
  const deleteMutation = useDeleteDishImage();

  const isBusy = uploadMutation.isPending || deleteMutation.isPending;

  const handleFile = (file: File) => {
    if (file.size > MAX_BYTES) {
      import('sonner').then(({ toast }) => toast.error('File too large — maximum 5 MB'));
      return;
    }
    uploadMutation.mutate({ dishId, file });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className='space-y-2'>
      {imageUrl ? (
        <div className='relative group rounded-xl overflow-hidden border border-ob-border'>
          <AppImage src={imageUrl} alt={dishName} aspectRatio='4/3' className='rounded-xl' />

          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center gap-2',
              'bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity',
            )}
          >
            <button type='button' onClick={() => fileInputRef.current?.click()} disabled={isBusy} className='btn-secondary text-xs px-3 py-1.5'>
              Replace
            </button>
            <button type='button' onClick={() => setDeleteTarget(dishId)} disabled={isBusy} className='btn-danger text-xs px-3 py-1.5'>
              Remove
            </button>
          </div>

          {uploadMutation.isPending && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <Spinner variant='white' size='md' />
            </div>
          )}
        </div>
      ) : (
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          disabled={isBusy}
          className={cn(
            'w-full aspect-4/3 rounded-xl border-2 border-dashed transition-all',
            'flex flex-col items-center justify-center gap-2 text-center',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ob-caramel',
            dragOver ? 'border-ob-caramel bg-ob-caramel/5 scale-[1.01]' : 'border-ob-border hover:border-ob-caramel/50 hover:bg-ob-blue/20',
            isBusy && 'opacity-60 pointer-events-none',
          )}
        >
          {uploadMutation.isPending ? (
            <Spinner variant='caramel' size='md' />
          ) : (
            <>
              <span className='text-2xl'>🖼️</span>
              <div>
                <p className='text-xs font-medium text-ob-text'>Click or drag to upload</p>
                <p className='text-[10px] text-ob-muted mt-0.5'>JPEG · PNG · WebP · max 5 MB</p>
              </div>
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type='file'
        accept={ACCEPTED}
        className='sr-only'
        onChange={handleInputChange}
        aria-label={`Upload image for ${dishName}`}
      />
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title='Delete image'
        message='Are you sure you want to delete this image? This action cannot be undone.'
        isPending={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(deleteTarget!, {
            onSettled: () => setDeleteTarget(null),
          })
        }
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
