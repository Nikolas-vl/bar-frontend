import { useEffect, type RefObject } from 'react';

export interface UseDismissableLayerOptions {
  isOpen: boolean;
  onDismiss: () => void;
  refs: ReadonlyArray<RefObject<HTMLElement | null>>;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  ignoredSelectors?: ReadonlyArray<string>;
}

const DEFAULT_IGNORED_SELECTORS = ['[data-radix-popper-content-wrapper]', '[data-dismissable-layer-ignore]'] as const;

export function useDismissableLayer({
  isOpen,
  onDismiss,
  refs,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  ignoredSelectors = DEFAULT_IGNORED_SELECTORS,
}: UseDismissableLayerOptions) {
  useEffect(() => {
    if (!isOpen || (!closeOnEscape && !closeOnOutsideClick)) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!closeOnOutsideClick) return;
      if (event.button !== 0 && event.pointerType !== 'touch') return;

      const target = event.target;
      if (!(target instanceof Node)) return;

      const isInsideLayer = refs.some(ref => ref.current?.contains(target));
      if (isInsideLayer) return;

      if (target instanceof Element && ignoredSelectors.some(selector => target.closest(selector))) {
        return;
      }

      onDismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!closeOnEscape) return;
      if (event.key !== 'Escape') return;
      onDismiss();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onDismiss, refs, closeOnEscape, closeOnOutsideClick, ignoredSelectors]);
}
