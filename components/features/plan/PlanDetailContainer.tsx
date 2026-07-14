'use client';

import { useEffect, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { scheduleItemsQueryOptions, useGetScheduleItems } from '@/hooks/plan/useGetScheduleItems';
import { useGetPlanDetail } from '@/hooks/plan/useGetPlanDetail';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import PlanDayPanel from '@/components/features/plan/PlanDayPanel';
import GoogleMapJS from '../map/GoogleMapJS';
import GoogleMapEmbed from '../map/GoogleMapEmbed';
import { PlaceCategory } from '@/types/CorePlace';
import { DESTINATIONS } from '@/lib/utils/destinations';
import PlanPlaceListContainer from './PlaceList/PlanPlaceListContainer';

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
      {/* 지도 배경 영역 — 추후 GoogleMapJS or GoogleMapEmbed로 교체 */}
      {/* <div className='absolute inset-0 bg-brand-blue-50' /> */}

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
        <div className='absolute top-[90px] right-[42px] w-[472px] bottom-6'>
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

      <PlanPlaceListContainer
        planId={planId}
        scheduleId={currentSchedule.id}
      />
    </div>
  );
}
