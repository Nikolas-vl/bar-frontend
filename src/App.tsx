import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router/router';
import { PageLoader } from './components/ui/PageLoader';
import { AppToaster } from './components/ui/AppToaster.tsx';

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
