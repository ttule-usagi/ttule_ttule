import { useInfiniteQuery, type UseInfiniteQueryResult } from '@tanstack/react-query';
import type { PlaceSearchResults } from '@/types/CorePlace';

interface FetchPlaceSearchProps {
  query: string;
  limit?: number;
  offset?: number;
}

const fetchPlaceSearch = async ({
  query,
  limit = 10,
  offset = 0,
}: FetchPlaceSearchProps): Promise<PlaceSearchResults> => {
  const params = new URLSearchParams({ query, limit: String(limit), offset: String(offset) });
  const res = await fetch(`/api/view/search?${params.toString()}`);

  if (!res.ok) throw new Error('검색 결과를 가져오는 데 실패했습니다.');
  return res.json();
};

export const useSearchPlaces = (query: string): UseInfiniteQueryResult<PlaceSearchResults, Error> => {
  const trimmedQuery = query.trim();

  return useInfiniteQuery({
    queryKey: ['place-search', trimmedQuery],
    queryFn: ({ pageParam = 0 }) => fetchPlaceSearch({ query: trimmedQuery, offset: pageParam }),
    // 검색어가 비어있으면 요청 자체를 보내지 않음
    enabled: trimmedQuery.length > 0,
    // 더보기(바닥 도달) 시 다음 호출의 pageParam(offset) 계산
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return loaded < lastPage.totalCount ? loaded : undefined;
    },
    initialPageParam: 0,
    select: (data): PlaceSearchResults => ({
      items: data.pages.flatMap((p) => p.items),
      totalCount: data.pages[0]?.totalCount ?? 0,
    }),
  });
};
