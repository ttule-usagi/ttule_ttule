import { useSuspenseInfiniteQuery, type UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';
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

export const useSearchPlaces = (query: string): UseSuspenseInfiniteQueryResult<PlaceSearchResults, Error> => {
  const trimmedQuery = query.trim();

  const result = useSuspenseInfiniteQuery({
    queryKey: ['place-search', trimmedQuery],
    queryFn: ({ pageParam = 0 }) => fetchPlaceSearch({ query: trimmedQuery, offset: pageParam }),
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

  // 더보기(자동 스크롤) 에러는 컴포넌트 내부에서 처리, 그 외는 ErrorBoundary로 전파
  if (result.error && !result.isFetching && !result.isFetchNextPageError) {
    throw result.error;
  }

  return result;
};
