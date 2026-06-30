import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import CoreSearchResultList from '@/components/features/search/CoreSearchResultList';
import { prefetchPlaceSearch } from '@/lib/actions/prefetchPlaceSearch';

interface CoreSearchPageProps {
  searchParams: Promise<{ query: string }>;
}

export default async function CoreSearchPage({ searchParams }: CoreSearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.query?.trim();

  // 검색 페이지 url에 직접 접근할 때를 대비하여 작성
  if (!keyword) {
    return <div>검색어를 입력해주세요.</div>;
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
    },
  });
  await prefetchPlaceSearch(queryClient, keyword);

  return (
    <div className='w-full flex flex-col'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <QueryBoundary>
          <CoreSearchResultList keyword={keyword} />
        </QueryBoundary>
      </HydrationBoundary>
    </div>
  );
}
