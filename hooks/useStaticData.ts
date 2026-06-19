// hooks/useStaticData.ts
'use client';

import { useQuery } from '@tanstack/react-query';

export function useCountries(enabled: boolean) {
  return useQuery({
    queryKey: ['static-data', 'countries'],
    queryFn: async () => (await import('@/lib/utils/countries')).COUNTRIES,
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useDestinations(enabled: boolean) {
  return useQuery({
    queryKey: ['static-data', 'destinations'],
    queryFn: async () => (await import('@/lib/utils/destinations')).DESTINATIONS,
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
