// hooks/corePlace/useCheckCorePlaceExists.ts
import { useQuery } from '@tanstack/react-query';

import { checkCorePlaceExists } from '@/lib/actions/checkCorePlaceExists';

export const useCheckCorePlaceExists = (googlePlaceId: string) => {
  return useQuery({
    queryKey: ['corePlace', 'exists', googlePlaceId],
    queryFn: () => checkCorePlaceExists(googlePlaceId),
    staleTime: 1000 * 60, // 등록 여부가 자주 바뀌는 값은 아니니 1분 정도 캐시
  });
};
