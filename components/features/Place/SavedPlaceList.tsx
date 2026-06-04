import { PlaceListOverview } from '@/types/placeList';
import PlaceListItem from './PlaceListItem';

const SavedPlaces = [
  {
    id: 1,
    title: '교토 나들이',
    isPublic: true,
    placeCount: 32,
    icon: '⭐️',
  },
  {
    id: 2,
    title: '교토 나들이',
    isPublic: true,
    placeCount: 32,
    icon: '🌸',
  },
  {
    id: 3,
    title: '교토 나들이',
    isPublic: false,
    placeCount: 32,
    icon: '👩‍❤️‍👩',
  },
  {
    id: 4,
    title: '교토 나들이',
    isPublic: false,
    placeCount: 32,
    icon: '🎧',
  },
];

export default function SavedPlaceList() {
  return (
    <div className='flex flex-col gap-3'>
      {SavedPlaces.map((item: PlaceListOverview) => (
        <PlaceListItem
          key={item.id}
          place={item}
        />
      ))}
    </div>
  );
}
