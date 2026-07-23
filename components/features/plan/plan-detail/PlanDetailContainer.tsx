'use client';

import { useEffect, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { scheduleItemsQueryOptions, useGetScheduleItems } from '@/hooks/plan/useGetScheduleItems';
import { useGetPlanDetail } from '@/hooks/plan/useGetPlanDetail';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlanDayPanel from '@/components/features/plan/plan-detail/PlanDayPanel';
import GoogleMapJS from '../../map/GoogleMapJS';
import GoogleMapEmbed from '../../map/GoogleMapEmbed';
import { PlaceCategory } from '@/types/corePlace';
import { DESTINATIONS } from '@/lib/utils/destinations';
import PlanPlaceListContainer from '../placeList/PlanPlaceListContainer';

interface PlanDetailContainerProps {
  planId: string;
}

export default function PlanDetailContainer({ planId }: PlanDetailContainerProps) {
  const queryClient = useQueryClient();
  const { data } = useGetPlanDetail(planId);
  const { plan, schedules, members, items: firstScheduleItems } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSchedule = schedules[currentIndex];

  const { data: items = [], isFetching } = useGetScheduleItems(
    planId,
    currentSchedule.id,
    currentIndex === 0 ? firstScheduleItems : undefined,
  );

  const coordinates = useMemo(
    () =>
      items
        .filter((item) => item.latitude && item.longitude)
        .map((item) => ({
          lat: item.latitude!,
          lng: item.longitude!,
          placeName: item.placeName,
          category: item.placeCategory as PlaceCategory | null,
        })),
    [items],
  );
  const [stableCoordinates, setStableCoordinates] = useState(coordinates);

  useEffect(() => {
    if (!isFetching) {
      setStableCoordinates(coordinates);
    }
  }, [isFetching, coordinates]);

  const destination =
    DESTINATIONS.find((c) => c.city === plan.destination) ?? DESTINATIONS.find((c) => c.city === '서울')!; // 못찾으면 한국 기본값

  const handleNext = () => {
    const nextSchedule = schedules[currentIndex + 1];
    if (nextSchedule) {
      queryClient.prefetchQuery(scheduleItemsQueryOptions(planId, nextSchedule.id));
    }
    setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    // 이전 일차는 이미 한번 조회했던 캐시가 남아있을 가능성이 높아서 prefetch 불필요
    setCurrentIndex((i) => i - 1);
  };

  return (
    <div className='relative h-screen w-full overflow-hidden'>
      {stableCoordinates.length > 0 ? (
        <GoogleMapJS
          coordinates={stableCoordinates}
          defaultCenter={{ lat: destination.latitude, lng: destination.longitude }}
          defaultZoom={5}
        />
      ) : (
        <GoogleMapEmbed
          mode='view'
          center={`${destination.latitude},${destination.longitude}`}
          zoom='11'
        />
      )}
      {/* 오른쪽 일정 패널 */}
      <QueryBoundary>
        <div className='absolute top-22 right-10 bottom-6 max-w-118 min-w-98.5 w-[40vw]'>
          <PlanDayPanel
            planId={planId}
            schedule={currentSchedule}
            schedules={schedules}
            items={items}
            isFetching={isFetching}
            currentIndex={currentIndex}
            totalDays={schedules.length}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      </QueryBoundary>

      <PlanPlaceListContainer planId={planId} />
    </div>
  );
}
