import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/utils/cn';
import { IconClose } from '@/shared/assets/icons';
import { useDismissableLayer } from '@/shared/hooks/useDismissableLayer';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const dismissRefs = useMemo(() => [modalRef], []);

  useDismissableLayer({
    isOpen,
    onDismiss: onClose,
    refs: dismissRefs,
  });

  // Prevent body scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div role='dialog' aria-modal='true' className='fixed inset-0 z-100 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' />

      <div ref={modalRef} className={cn('relative card p-0 overflow-hidden w-full', SIZE_CLASS[size])}>
        <div className='flex items-center justify-between px-6 py-4 border-b border-ob-border'>
          <h2 className='text-lg font-display font-semibold text-ob-text'>{title}</h2>
          <button type='button' onClick={onClose} className='btn-icon-ghost' aria-label='Close modal'>
            <IconClose className='w-5 h-5' />
          </button>
        </div>

        <div className='px-6 py-5 max-h-[70vh] overflow-y-auto'>{children}</div>

        {footer && <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-ob-border bg-ob-bg/50'>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
