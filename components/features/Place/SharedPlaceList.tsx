import PlaceListItem from './PlaceListItem';

const SharedPlaces = [
  {
    id: 1,
    name: '교토 나들이',
    isShared: true,
    placeCount: 18,
    icon: '🐠',
  },
  {
    id: 2,
    name: '교토 나들이',
    isShared: true,
    placeCount: 32,
    icon: '🍀',
  },
  {
    id: 3,
    name: '교토 나들이',
    isShared: false,
    placeCount: 12,
    icon: '👀',
  },
  {
    id: 4,
    name: '교토 나들이',
    isShared: true,
    placeCount: 10,
    icon: '🌳',
  },
];

export default function SharedPlaceList() {
  return (
    <div className='flex flex-col gap-3'>
      {SharedPlaces.map((item) => (
        <PlaceListItem
          key={item.id}
          place={item}
        />
      ))}
    </div>
  );
}
