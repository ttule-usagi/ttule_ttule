
import { AllPlaceLists, ListType } from '@/types/placeList';
import { useSuspenseInfiniteQuery, UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';

const fetchAllPlaceLists = async ({
  listType,
  offset = 0,
}: {
  listType: ListType;
  offset?: number;
}): Promise<AllPlaceLists> => {
  const params = new URLSearchParams({ listType, offset: String(offset) });
  const res = await fetch(`/api/view/place-list?${params.toString()}`);
  if (!res.ok) throw new Error('장소 리스트를 가져오는 데 실패했습니다.');
  return res.json();
};

export const useGetAllPlaceLists = (listType: ListType): UseSuspenseInfiniteQueryResult<AllPlaceLists, Error> => {
  const query = useSuspenseInfiniteQuery({
    queryKey: ['place-list', listType],
    queryFn: ({ pageParam = 0 }) => fetchAllPlaceLists({ listType, offset: pageParam }),
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

  // 자동 refetch 에러는 수동으로 ErrorBoundary에 전파
  // fetchNextPage 에러(isFetchNextPageError)는 기존 리스트 데이터를 유지한 채 에러 메시지만 표시하기 위해 컴포넌트 내부에서 처리
  if (query.error && !query.isFetching && !query.isFetchNextPageError) {
    throw query.error;
  }

  return query;
};
