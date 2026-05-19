interface Props {
  place: any;
  onClick: (place: any) => void;
}

export default function SearchResultItem({ place, onClick }: Props) {
  return (
    <div
      key={place.id}
      className='p-3 border-1 border-brand-gray-300 rounded-sm bg-brand-gray-0 hover:bg-gray-50 cursor-pointer'
      onClick={() => onClick(place)}
    >
      <div className='text-typo-sub-title text-brand-blue-700 '>{place.displayName?.text}</div>
      <div className='text-typo-description text-gray-400 '>
        {place.primaryTypeDisplayName?.text} · {place.shortFormattedAddress}
      </div>
    </div>
  );
}
