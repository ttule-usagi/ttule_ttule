import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Link from 'next/link';

import { Icon } from '@/components/common/Icon';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import JoinPlaceListButton from '@/components/features/place-list/JoinPlaceListButton';
import PlaceList from '@/components/features/place-list/PlaceList';
import { prefetchPlaceList } from '@/lib/actions/api/prefetch/prefetchPlaceList';
import { getQueryClient } from '@/lib/utils/getQueryClient';

export default async function Page() {
  const queryClient = getQueryClient();
  await prefetchPlaceList(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='flex flex-col h-full gap-6'>
        <div className='flex-none text-typo-big-title font-semibold text-brand-blue-700 px-4'>저장된 장소 리스트</div>

        <div className='flex-1 px-4 overflow-y-auto pb-7'>
          <Link
            href='/places/create'
            className='w-full max-h-19 flex justify-center items-center py-5.5 text-brand-gray-400 text-typo-sub-title font-medium mb-3 gap-2 wobbly-box hover:text-brand-blue-700'
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

          <div className='mt-17.5 flex justify-between items-center h-8 w-full mb-3'>
            <p className='text-typo-title font-semibold text-brand-blue-700'>공유된 장소 리스트</p>
            <JoinPlaceListButton />
          </div>
          <QueryBoundary>
            <PlaceList
              listType='shared'
              emptyText='초대된 장소 리스트가 아직 없습니다.'
            />
          </QueryBoundary>
        </div>
      </div>
    </HydrationBoundary>
  );
}
