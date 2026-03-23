import { AdminModal } from './AdminModal';
import { Spinner } from '@/components/shared/ui';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
  confirmLabel?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isPending = false,
  confirmLabel = 'Delete',
}: ConfirmDialogProps) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size='sm'
      footer={
        <>
          <button type='button' className='btn-ghost' onClick={onCancel} disabled={isPending}>
            Cancel
          </button>
          <button
            type='button'
            className='btn-danger inline-flex items-center gap-2'
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Spinner variant='white' size='sm' />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className='text-ob-muted text-sm leading-relaxed'>{message}</p>
    </AdminModal>
  );
}
