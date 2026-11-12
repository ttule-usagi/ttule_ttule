import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import SearchSection from '@/components/common/SearchSection';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import LobbyPlanSection from '@/components/features/plan/lobby/LobbyPlanSection';
import Footer from '@/components/layouts/Footer';
import { prefetchLobbyPlanList } from '@/lib/actions/api/prefetch/prefetchLobbyPlanList';
import { prefetchUserInfo } from '@/lib/actions/api/prefetch/prefetchUserInfo';
import { getQueryClient } from '@/lib/utils/getQueryClient';

export default async function Page() {
  const queryClient = getQueryClient();
  await Promise.all([prefetchLobbyPlanList(queryClient), prefetchUserInfo(queryClient)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='h-full w-full overflow-y-auto'>
        <div className='max-w-130 md:max-w-350 mx-auto px-4 md:px-16 pb-40'>
          {/* 공지 - 2차 */}
          {/* <NoticeHeader /> */}

          {/* 헤더 및 여행 아이템 섹션 */}
          <SearchSection />
          <QueryBoundary subject='여행 목록'>
            <LobbyPlanSection />
          </QueryBoundary>
        </div>
        <Footer />
      </div>
    </HydrationBoundary>
  );
}
