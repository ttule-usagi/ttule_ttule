import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import type { CorePlaceDetail } from '@/types/CorePlace';

const fetchCorePlace = async (placeId: string): Promise<CorePlaceDetail> => {
  const res = await fetch(`/api/view/place/${placeId}`);

  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (res.status === 404) throw new Error('PLACE_NOT_FOUND');
  if (!res.ok) throw new Error('장소 정보를 가져오는 데 실패했습니다.');

  return res.json();
};

export const corePlaceDetailQueryOptions = (placeId: string) =>
  queryOptions({
    queryKey: ['core-place', placeId],
    queryFn: () => fetchCorePlace(placeId),
  });

export const useGetCorePlace = (placeId: string) => {
  return useSuspenseQuery(corePlaceDetailQueryOptions(placeId));
};