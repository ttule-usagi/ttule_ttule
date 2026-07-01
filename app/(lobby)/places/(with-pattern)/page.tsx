import { Icon } from '@/components/common/Icon';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlaceList from '@/components/features/Place/PlaceList';
import { prefetchPlaceList } from '@/lib/actions/prefetch/prefetchPlaceList';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export default async function Page() {
  const queryClient = new QueryClient();
  await prefetchPlaceList(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='text-typo-big-title font-semibold text-brand-blue-700 pb-6'>저장된 장소 리스트</div>
      <Link
        href='/places/create'
        className='w-full max-h-19 flex justify-center items-center py-5.5 text-brand-gray-400 text-typo-sub-title font-medium mb-3 gap-2 wobbly-box'
      >
        <Icon
          name='Plus'
          size={32}
        />
        장소 리스트 만들기
      </Link>
      <QueryBoundary>
        <PlaceList
          listType='owned'
          emptyText='장소 리스트가 아직 없습니다.'
        />
      </QueryBoundary>

      <div className='mt-17.5 text-typo-title font-semibold text-brand-blue-700 pb-6'>공유된 장소 리스트</div>
      <QueryBoundary>
        <PlaceList
          listType='shared'
          emptyText='초대된 장소 리스트가 아직 없습니다.'
        />
      </QueryBoundary>
    </HydrationBoundary>
  );
}
