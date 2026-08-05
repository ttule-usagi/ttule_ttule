import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import LobbyPlanSection from '@/components/features/plan/lobby/LobbyPlanSection';
import { prefetchLobbyPlanList } from '@/lib/actions/api/prefetch/prefetchLobbyPlanList';
import { getQueryClient } from '@/lib/utils/getQueryClient';

export default async function Page() {
  const queryClient = getQueryClient();
  await prefetchLobbyPlanList(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='h-full max-w-350 min-w-230 mx-auto mt-5.5 pl-16 pr-16 pb-60'>
        {/* 공지 - 2차 */}
        {/* <NoticeHeader /> */}

        {/* 헤더 및 여행 아이템 섹션 */}
        <QueryBoundary subject='여행 목록'>
          <LobbyPlanSection />
        </QueryBoundary>
      </div>
    </HydrationBoundary>
  );
}
