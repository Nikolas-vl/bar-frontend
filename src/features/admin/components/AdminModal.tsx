import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { IconClose } from '@/assets/icons';

type ModalSize = 'sm' | 'md' | 'lg';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: ModalSize;
  footer?: ReactNode;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function AdminModal({ isOpen, onClose, title, children, size = 'md', footer }: AdminModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  // Close on Escape
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-modal='true'
      className={cn(
        'backdrop:bg-black/40 backdrop:backdrop-blur-sm',
        'bg-transparent p-0 m-auto',
        'open:animate-in open:fade-in-0 open:zoom-in-95',
        'w-[calc(100%-2rem)]',
        SIZE_CLASS[size],
      )}
    >
      <div className='card p-0 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-ob-border'>
          <h2 className='text-lg font-display font-semibold text-ob-text'>{title}</h2>
          <button
            type='button'
            onClick={onClose}
            className='btn-icon-ghost'
            aria-label='Close modal'
          >
            <IconClose className='w-5 h-5' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5 max-h-[70vh] overflow-y-auto'>{children}</div>

        {/* Footer */}
        {footer && (
          <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-ob-border bg-ob-bg/50'>
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
