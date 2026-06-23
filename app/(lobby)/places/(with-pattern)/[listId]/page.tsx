// 임시: 장소 리스트에 저장되지 않은 Place 데이터
import { Place, Tag } from '@/types/placeList';
import TagList from '@/components/features/Place/TagList';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { placeListDetailQueryOptions, placeListPlacesQueryOptions } from '@/hooks/place-list/useGetPlaceListDetail';
import PlaceListHeader from '@/components/features/Place/PlaceListHeader';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlaceListPlaces from '@/components/features/Place/PlaceListPlaces';

const listData = {
  placesData: [
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
      tags: [
        { id: 1, name: '간식먹방', color: 'RED' },
        { id: 4, name: '문화생활~', color: 'PURPLE' },
      ],
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
      tags: [
        { id: 2, name: '카페', color: 'YELLOW' },
        { id: 3, name: '잼컨', color: 'GREEN' },
        { id: 4, name: '문화생활~', color: 'PURPLE' },
        { id: 5, name: '문화유산', color: 'GRAY' },
        { id: 6, name: '음식점', color: 'HOTPINK' },
        { id: 7, name: '숙소', color: 'BLUE' },
      ],
      createdAt: new Date('2026-05-11T15:30:00Z'),
      updatedAt: new Date('2026-05-11T15:30:00Z'),
    },
  ] as Place[],
  listTag: [
    {
      id: 1,
      name: '간식먹방',
      color: 'RED',
    },
    { id: 2, name: '카페', color: 'YELLOW' },
    { id: 3, name: '잼컨', color: 'GREEN' },
    { id: 4, name: '문화생활~', color: 'PURPLE' },
    { id: 5, name: '문화유산', color: 'GRAY' },
    { id: 6, name: '음식점', color: 'HOTPINK' },
    { id: 7, name: '숙소', color: 'BLUE' },
  ] as Tag[],
};

export default async function PlaceListDetail({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(placeListDetailQueryOptions(listId)),
    queryClient.prefetchInfiniteQuery(placeListPlacesQueryOptions(listId)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='flex flex-col gap-5.5'>
        <QueryBoundary>
          <PlaceListHeader listId={listId} />
        </QueryBoundary>

        <div className='flex flex-col gap-3'>
          <TagList tags={listData.listTag} />
          <QueryBoundary>
            <PlaceListPlaces listId={listId} />
          </QueryBoundary>
        </div>
      </div>
    </HydrationBoundary>
  );
}
