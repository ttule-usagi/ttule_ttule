interface Props {
  isLoading: boolean;
  submittedQuery: string;
  results: any[];
}

export default function SearchInteraction({ isLoading, submittedQuery, results }: Props) {
  // 1. 검색 중
  if (isLoading) {
    return <p className='text-sm text-gray-400 text-center'>검색 중...</p>;
  }

  // 2. 아직 검색 안 한 상태 (초기 화면)
  if (!submittedQuery) {
    return <p className='text-sm text-gray-500 text-center'>국가 설정시 더 정확한 결과를 얻을 수 있어요.</p>;
  }

  // 3. 검색했는데 결과 없음
  if (results.length === 0) {
    return <p className='text-sm text-gray-400 text-center'>검색 결과가 없습니다.</p>;
  }

  // 4. 검색 결과 있음
  return (
    <div className='pt-4 border-t-1 border-t-brand-gray-300'>
      <h4 className='text-typo-base-bold text-brand-gray-600'>구글 검색결과</h4>
    </div>
  );
}
