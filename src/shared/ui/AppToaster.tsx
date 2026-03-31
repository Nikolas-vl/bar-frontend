import { Toaster } from 'sonner';

export const AppToaster = () => (
  <Toaster
    position='top-right'
    closeButton
    toastOptions={{
      closeButton: true,
      closeButtonAriaLabel: 'Close notification',
      duration: 4000,
      classNames: {
        toast: ['font-sans text-sm rounded-xl', 'shadow-[0_4px_16px_rgba(47,47,47,0.10)]'].join(' '),
        success: ['!bg-green-50 !border !border-green-200', '!text-green-900'].join(' '),
        error: ['!bg-red-50 !border !border-red-200', '!text-red-900'].join(' '),
        info: '!bg-ob-blue !border !border-ob-border !text-ob-text',
        warning: '!bg-amber-50 !border !border-amber-200 !text-amber-900',
        closeButton: [
          '!bg-ob-surface !border-ob-border !text-ob-muted',
          'hover:!bg-ob-blue hover:!text-ob-text',
          'focus:!outline-none focus:!ring-2 focus:!ring-ob-caramel/40',
        ].join(' '),
      },
    }}
    icons={{
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️',
    }}
  />
);
