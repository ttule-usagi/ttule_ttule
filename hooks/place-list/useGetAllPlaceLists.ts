import { getAllPlaceLists } from '@/lib/actions/placeList';
import { AllPlaceLists, ListType } from '@/types/placeList';
import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';

export const useGetAllPlaceLists = (listType: ListType): UseInfiniteQueryResult<AllPlaceLists, Error> => {
  return useInfiniteQuery({
    queryKey: ['place-list', listType],
    queryFn: ({ pageParam = 0 }) => getAllPlaceLists({ listType, offset: pageParam }),
    // 더보기 버튼 클릭 시 다음 호출의 pageParam(offset) 계산
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return loaded < lastPage.totalCount ? loaded : undefined;
    },
    initialPageParam: 0,
    select: (data): AllPlaceLists => ({
      items: data.pages.flatMap((p) => p.items),
      totalCount: data.pages[0]?.totalCount ?? 0,
    }),
  });
};
