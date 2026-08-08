import { useGetScheduleItems } from '@/hooks/plan/useGetScheduleItems';
import { useInViewOnce } from '@/hooks/plan/useInViewOnce';
import { PlanInfo, PlanItem, PlanSchedule } from '@/types/plan';

import PlanDayPanel from './PlanDayPanel';

interface OverviewDayEntryProps {
  planId: string;
  plan: PlanInfo;
  schedule: PlanSchedule;
  schedules: PlanSchedule[];
  initialItems?: PlanItem[];
  hasSession: boolean;
  onOpenPlaceDetail: (item: PlanItem) => void;
}

// OverviewDayEntry.tsx
export function OverviewDayEntry({
  planId,
  plan,
  schedule,
  schedules,
  initialItems,
  hasSession,
  onOpenPlaceDetail,
}: OverviewDayEntryProps) {
  const { ref, inView } = useInViewOnce('400px');

  const { data: items = [], isFetching } = useGetScheduleItems(
    planId,
    schedule.id,
    initialItems,
    !!initialItems || inView, // enabled: 1일차는 항상, 나머지는 뷰포트 근처일 때만
  );

  return (
    <div
      ref={ref}
      className='w-102 shrink-0'
    >
      <PlanDayPanel
        variant='stacked'
        planId={planId}
        plan={plan}
        schedule={schedule}
        schedules={schedules}
        items={items}
        isFetching={isFetching}
        hasSession={hasSession}
        onOpenPlaceDetail={onOpenPlaceDetail}
      />
    </div>
  );
}
