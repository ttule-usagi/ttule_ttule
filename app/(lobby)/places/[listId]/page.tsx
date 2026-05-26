// 임시: 장소 리스트에 저장되지 않은 Place 데이터
import { Place } from '@/types/placeList';
import { Icon } from '@/components/common/Icon';
import PlaceItem from '@/components/features/Place/PlaceItem';
import PlaceListDropdownMenu from '@/components/features/Place/PlaceListDropdwonMenu';

const placesData: Place[] = [
  {
    id: 201,
    placeListId: 0, // 저장되지 않은 상태이므로 0 또는 null
    corePlaceId: 1001,
    latitude: 37.5665,
    longitude: 126.978,
    customName: '로프트 루프탑',
    category: '카페',
    thumbnail: null,
    memoContent: '타코야끼먹고싶다',
    createdAt: new Date('2026-05-10T10:00:00Z'),
    updatedAt: new Date('2026-05-10T10:00:00Z'),
  },
  {
    id: 202,
    placeListId: 0,
    corePlaceId: 1002,
    latitude: 37.57,
    longitude: 126.982,
    customName: '로프트 스튜디오',
    category: '스튜디오',
    thumbnail: null,
    memoContent: null,
    createdAt: new Date('2026-05-11T15:30:00Z'),
    updatedAt: new Date('2026-05-11T15:30:00Z'),
  },
];

export default async function PlaceListDetail({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  // const res = await fetch('데이터 요청')
  // const places = await res.json()

  return (
    <div className='flex flex-col text-typo-big-title text-brand-blue-700 gap-5.5'>
      <header className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <span className='font-mona12'>🐠</span>
          <p className='font-semibold flex-1'>교토나들이</p>

          <div className='flex gap-3'>
            <Icon
              name='Share'
              size={32}
              className='cursor-pointer'
            />
            <PlaceListDropdownMenu />
          </div>
        </div>

        <div className='flex flex-col gap-1 text-typo-base font-light'>
          <div className='flex gap-3 text-brand-gray-400'>
            <span>마스터닉네임</span>
            <span>이미지</span>
            <span>장소 32개</span>
            <span>공유됨</span>
          </div>
          <p className='text-brand-gray-600'>따뜻한 봄에 즐거운 여행을</p>
        </div>
      </header>

      <div className='flex flex-col gap-3'>
        {placesData.map((item) => (
          <PlaceItem
            key={item.id}
            place={item}
          />
        ))}
      </div>
    </div>
  );
}
