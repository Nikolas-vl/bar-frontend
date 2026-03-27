import { Toaster } from 'sonner';

export const AppToaster = () => (
  <Toaster
    position='top-right'
    closeButton
    toastOptions={{
      closeButton: true,
      closeButtonAriaLabel: 'Close notification',
      style: {
        background: '#FFFFFF',
        border: '1px solid #E5E5E5',
        color: '#2F2F2F',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(47,47,47,0.10)',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: '14px',
      },
      classNames: {
        closeButton:
          '!bg-ob-surface !border-ob-border !text-ob-muted hover:!bg-ob-blue hover:!text-ob-text focus:!outline-none focus:!ring-2 focus:!ring-ob-caramel/40',
      },
    }}
    icons={{
      success: '☕',
      error: '✕',
      info: 'i',
      warning: '⚠',
      close: 'x',
    }}
  />
);
