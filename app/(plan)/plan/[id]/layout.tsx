import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchPlanDetail } from '@/lib/actions/prefetch/prefetchPlanDetail';
import PlanHeader from '@/components/features/plan/PlanHeader';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* 공통 헤더 - 계획 정보 표시 */}
      <QueryBoundary>
        <PlanHeader planId={id} />
      </QueryBoundary>
      {/* 모드별 컨텐츠 */}
      {children}
    </HydrationBoundary>
  );
}
