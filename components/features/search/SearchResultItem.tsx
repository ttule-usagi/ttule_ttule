interface Props {
  place: any;
  onClick: (place: any) => void;
}

export default function SearchResultListItem({ place, onClick }: Props) {
  // 검색결과 중 'ㅣ'가 들어있는 에외처리
  const getDisplayName = (placeName?: string) => {
    if (!placeName) return '';
    if (placeName.includes('ㅣ')) return placeName.split('ㅣ')[0].trim();
    return placeName;
  };
  return (
    <div
      key={place.id}
      className='p-3 border-1 border-brand-gray-300 rounded-sm bg-brand-gray-0 hover:bg-gray-50 cursor-pointer'
      onClick={() => onClick(place)}
    >
      <div className='text-typo-sub-title text-brand-blue-700 '>{getDisplayName(place.displayName?.text)}</div>
      <div className='text-typo-description text-gray-400 '>{place.shortFormattedAddress}</div>
    </div>
  );
}
