'use client';

import { useEffect, useState } from 'react';

export function useFetch<TData>(fetcher: () => Promise<TData>) {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetcher()
      .then((result) => {
        if (isMounted) {
          setData(result);
        }
      })
      .catch((error: Error) => {
        if (isMounted) {
          setHasError(error.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetcher]);

  return { data, isLoading, hasError };
}
