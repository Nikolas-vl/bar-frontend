import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './app/router/router.tsx';
import { PageLoader } from './shared/ui/PageLoader.tsx';
import { AppToaster } from './shared/ui/AppToaster.tsx';

export default function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
      <AppToaster />
    </>
  );
}
