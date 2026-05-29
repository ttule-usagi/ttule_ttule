import { useQuery } from '@tanstack/react-query';
import type { GooglePlaceDetail } from '@/types/googleSearchApiDetail';

export const useGooglePlaceDetail = (placeId: string | null) => {
  return useQuery({
    queryKey: ['googlePlaceDetail', placeId],
    queryFn: async (): Promise<GooglePlaceDetail> => {
      const res = await fetch(`/api/google-search?placeId=${placeId}`);
      if (!res.ok) throw new Error('Failed to fetch place detail');
      return res.json();
    },
    enabled: !!placeId, // placeId가 있을 때만 실행
    staleTime: 1000 * 60 * 60, // 1시간 동안 같은 장소 재호출 안 함
  });
};
