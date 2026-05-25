interface Props {
  isLoading: boolean;
  hasSearched: boolean;
  query: string;
  results: any[];
}

export default function SearchInteraction({ isLoading, hasSearched, query, results }: Props) {
  return (
    <div>
      {' '}
      {isLoading && <p className='text-sm text-gray-400 text-center'>검색 중...</p>}
      {!isLoading && hasSearched && results.length === 0 && (
        <p className='text-sm text-gray-400 text-center'>검색 결과가 없습니다.</p>
      )}
      {!isLoading && !query && (
        <p className='text-sm text-gray-500 text-center'>국가 설정시 더 정확한 결과를 얻을 수 있어요. </p>
      )}
      {hasSearched ? (
        <div className='pt-4 border-t-1 border-t-brand-gray-300'>
          <h4 className='text-typo-base-bold text-brand-gray-600'>구글 검색결과</h4>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
