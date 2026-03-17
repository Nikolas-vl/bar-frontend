import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export function RouteErrorBoundary() {
  const error = useRouteError();

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className='min-h-screen bg-ob-bg flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        <div className='w-20 h-20 rounded-3xl bg-ob-blue flex items-center justify-center mx-auto mb-6'>
          <span className='text-4xl'>{is404 ? '🗺️' : '🍊'}</span>
        </div>

        <h1 className='font-display text-6xl font-bold text-ob-caramel mb-4'>{isRouteErrorResponse(error) ? error.status : 'Oops'}</h1>

        <h2 className='font-display text-2xl font-semibold text-ob-text mb-3'>{is404 ? 'Page not found' : 'Something went wrong'}</h2>

        <p className='text-ob-muted text-sm mb-8'>
          {is404 ? "The page you're looking for doesn't exist or has been moved." : 'An unexpected error occurred on this route.'}
        </p>

        {import.meta.env.DEV && !isRouteErrorResponse(error) && error instanceof Error && (
          <div className='mb-6 text-left rounded-xl bg-red-50 border border-red-200 p-4'>
            <p className='text-xs font-mono text-red-600 break-all'>{error.message}</p>
          </div>
        )}

        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <Link to='/' className='btn-primary justify-center'>
            Back to home
          </Link>
          <button onClick={() => window.history.back()} className='btn-secondary justify-center'>
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
