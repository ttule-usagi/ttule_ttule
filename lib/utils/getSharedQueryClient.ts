// lib/utils/getSharedQueryClient.ts
import { cache } from 'react';
import { QueryClient } from '@tanstack/react-query';

export const getSharedQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    }),
);
