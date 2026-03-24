export function GlobalErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <div className='min-h-screen bg-ob-bg flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        <h1 className='text-xl font-semibold mb-2'>Something went wrong</h1>

        <p className='text-sm text-ob-muted mb-4'>An unexpected error occurred. Try again or go back home.</p>

        {import.meta.env.DEV && error && <pre className='text-xs text-red-500 mb-4 break-all'>{error.message}</pre>}

        <div className='flex gap-2 justify-center'>
          <button onClick={onReset} className='btn-primary'>
            Try again
          </button>

          <button onClick={() => (window.location.href = '/')} className='btn-secondary'>
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
