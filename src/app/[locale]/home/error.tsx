'use client';

import { useEffect } from 'react';
import ErrorPage from '@/components/common/ErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <ErrorPage 
      error={error}
      reset={reset}
    />
  );
}
