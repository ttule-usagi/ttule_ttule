import { useQuery } from '@tanstack/react-query';
import type { Country } from '@/lib/utils/countries';
import type { Destination } from '@/lib/utils/destinations';

export function useCountries(enabled = true) {
  return useQuery<Country[]>({
    queryKey: ['static-data', 'countries'] as const,
    queryFn: async () => {
      const { COUNTRIES } = await import('@/lib/utils/countries');
      return COUNTRIES as unknown as Country[];
    },
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useDestinations(enabled = true) {
  return useQuery<Destination[]>({
    queryKey: ['static-data', 'destinations'] as const,
    queryFn: async () => {
      const { DESTINATIONS } = await import('@/lib/utils/destinations');
      return DESTINATIONS as unknown as Destination[];
    },
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
