import { Toaster } from 'sonner';

export const AppToaster = () => (
  <Toaster
    position='top-right'
    toastOptions={{
      style: {
        background: '#FFFFFF',
        border: '1px solid #E5E5E5',
        color: '#2F2F2F',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(47,47,47,0.10)',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: '14px',
      },
    }}
    icons={{
      success: '☕',
      error: '✕',
      info: 'ℹ',
      warning: '⚠',
    }}
  />
);
