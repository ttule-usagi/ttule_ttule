import { PlaceListOverview } from '@/types/placeList';
import PlaceListItem from './PlaceListItem';

const PublicPlaces = [
  {
    id: 1,
    title: '교토 나들이',
    isPublic: true,
    placeCount: 18,
    icon: '🐠',
  },
  {
    id: 2,
    title: '교토 나들이',
    isPublic: true,
    placeCount: 32,
    icon: '🍀',
  },
  {
    id: 3,
    title: '교토 나들이',
    isPublic: false,
    placeCount: 12,
    icon: '👀',
  },
  {
    id: 4,
    title: '교토 나들이',
    isPublic: true,
    placeCount: 10,
    icon: '🌳',
  },
];

export default function PublicPlaceList() {
  return (
    <div className='flex flex-col gap-3'>
      {PublicPlaces.map((item: PlaceListOverview) => (
        <PlaceListItem
          key={item.id}
          place={item}
        />
      ))}
    </div>
  );
}
