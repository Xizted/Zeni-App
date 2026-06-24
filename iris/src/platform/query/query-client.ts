import { QueryClient } from '@tanstack/react-query';

import { HttpError } from '@/platform/network/http-error';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => {
          if (error instanceof HttpError && !error.retryable) {
            return false;
          }
          return failureCount < 2;
        },
        staleTime: 30_000,
      },
    },
  });
}
