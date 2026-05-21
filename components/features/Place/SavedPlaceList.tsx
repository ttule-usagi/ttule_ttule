import PlaceListItem from './PlaceListItem';

export interface PlaceItemProps {
  id: number;
  name: string;
  isShared: boolean;
  placeCount: number;
  icon: string;
}

const SavedPlaces = [
  {
    id: 1,
    name: '교토 나들이',
    isShared: true,
    placeCount: 32,
    icon: '⭐️',
  },
  {
    id: 2,
    name: '교토 나들이',
    isShared: true,
    placeCount: 32,
    icon: '🌸',
  },
  {
    id: 3,
    name: '교토 나들이',
    isShared: false,
    placeCount: 32,
    icon: '👩‍❤️‍👩',
  },
  {
    id: 4,
    name: '교토 나들이',
    isShared: false,
    placeCount: 32,
    icon: '🎧',
  },
];

export default function SavedPlaceList() {
  return (
    <div className='flex flex-col gap-3'>
      {SavedPlaces.map((item: PlaceItemProps) => (
        <PlaceListItem
          key={item.id}
          place={item}
        />
      ))}
    </div>
  );
}
