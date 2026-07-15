import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchPlanDetail } from '@/lib/actions/prefetch/prefetchPlanDetail';
import PlanHeader from '@/components/features/plan/PlanHeader';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import Script from 'next/script';
import CorePlaceSearchInput from '@/components/features/search/CorePlaceSearchInput';

export default async function PlanLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
    },
  });

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
          <PlanHeader planId={id} />
        </QueryBoundary>
        {/* 모드별 컨텐츠 */}
        {children}
      </HydrationBoundary>
      <div className='fixed top-0 w-102 z-100 px-4 pt-5'>
        <CorePlaceSearchInput />
      </div>
    </>
  );
}
