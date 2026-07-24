import { useSuspenseQuery } from '@tanstack/react-query';
import { placeListDetailQueryOptions } from './useGetPlaceListDetail';
import { PlaceListDetail } from '@/types/placeList';

// 장소 리스트 myRole 가져오기
export const useGetMyRole = (id: string) => {
  return useSuspenseQuery({
    ...placeListDetailQueryOptions(id),
    select: (data: PlaceListDetail) => data.myRole,
  });
};
