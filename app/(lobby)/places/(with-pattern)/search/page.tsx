import SearchResultList from '@/components/features/search/SearchResultList';

interface CoreSearchPageProps {
  searchParams: Promise<{ query: string }>;
}

export default async function CoreSearchPage({ searchParams }: CoreSearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.query;

  // 검색 페이지 url에 직접 접근할 때를 대비하여 작성
  if (!keyword) {
    return <div>검색어를 입력해주세요.</div>;
  }

  return (
    <div className='w-full flex flex-col'>
      <SearchResultList keyword={keyword} />
    </div>
  );
}
