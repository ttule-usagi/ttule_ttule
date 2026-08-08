import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Script from 'next/script';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlanClipboardCleanup from '@/components/features/plan/PlanClipboardCleanup';
import PlanHeader from '@/components/features/plan/PlanHeader';
import CorePlaceSearchInput from '@/components/features/search/CorePlaceSearchInput';
import { prefetchPlanDetail } from '@/lib/actions/api/prefetch/prefetchPlanDetail';
import { auth } from '@/lib/utils/auth';
import { getSharedQueryClient } from '@/lib/utils/getSharedQueryClient';

export default async function PlanLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const hasSession = session;

  const queryClient = getSharedQueryClient();
  await prefetchPlanDetail(queryClient, id);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async`}
        strategy='afterInteractive'
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* 공통 헤더 - 계획 정보 표시 */}
        <QueryBoundary>
          <PlanHeader
            planId={id}
            hasSession={!!session}
          />
        </QueryBoundary>
        {/* 모드별 컨텐츠 */}
        <PlanClipboardCleanup />
        {children}
      </HydrationBoundary>
      {hasSession && (
        <div className='fixed top-0 max-w-102 min-w-85 w-[26vw] z-100 px-4 pt-5'>
          <CorePlaceSearchInput />
        </div>
      )}
    </>
  );
}
