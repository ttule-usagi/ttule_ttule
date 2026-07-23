'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetUserPlans } from '@/hooks/plan/useGetUserPlans';
import { addPlanItemWithTransit } from '@/lib/actions/planItem';
import type { CorePlaceDetail } from '@/types/corePlace';
import ScheduleModalItem from '@/components/features/place/save/ScheduleModalItem';
import { Icon } from '@/components/common/Icon';

interface AddToScheduleModalProps {
  placeDetail: CorePlaceDetail;
  onClose: () => void;
}

export default function AddToScheduleModal({ placeDetail, onClose }: AddToScheduleModalProps) {
  const queryClient = useQueryClient();
  const { data: plans, isLoading: isPlansLoading } = useGetUserPlans();

  const [selectedScheduleIds, setSelectedScheduleIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 날짜 기준으로 현재/다가오는 여행 구분
  const today = new Date().toISOString().slice(0, 10);
  const currentPlans =
    plans?.filter(
      (p) =>
        !p.isDateUndecided && p.arrivalDate && p.arrivalDate >= today && p.departureDate && p.departureDate <= today,
    ) ?? [];
  const upcomingPlans = plans?.filter((p) => p.isDateUndecided || !p.departureDate || p.departureDate > today) ?? [];

  const handleSelectSchedule = (scheduleId: string) => {
    setSelectedScheduleIds((prev) => {
      const next = new Set(prev);
      if (next.has(scheduleId)) {
        next.delete(scheduleId); // 이미 선택된 경우 해제
      } else {
        next.add(scheduleId);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selectedScheduleIds.size === 0) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    // 선택된 모든 schedule에 병렬로 추가
    const results = await Promise.all(
      Array.from(selectedScheduleIds).map((scheduleId) => addPlanItemWithTransit({ scheduleId, placeDetail })),
    );

    setIsSubmitting(false);

    const hasError = results.some((r) => r.error);
    if (hasError) {
      setErrorMessage('일부 일정에 추가하지 못했습니다. 다시 시도해주세요.');
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ['plan'],
      refetchType: 'active',
    });

    onClose();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      onClick={onClose}
    >
      <div
        className='relative bg-white rounded-lg h-[50vh] w-80 flex flex-col gap-4 px-5 py-4'
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className='flex items-center justify-between'>
          <p className='text-typo-base-bold text-brand-gray-700'>여행 일정에 추가</p>
          <button
            onClick={onClose}
            aria-label='닫기'
          >
            <Icon
              name='XClose'
              size={26}
              className='text-brand-gray-600'
            />
          </button>
        </div>

        {/* plan 목록 */}
        <div className='flex flex-col gap-4 max-h-100 overflow-y-auto'>
          {isPlansLoading && <p className='text-typo-description text-brand-gray-400 text-center'>로딩 중...</p>}

          {/* 현재 여행 */}
          {currentPlans.length > 0 && (
            <div className='flex flex-col gap-[8px]'>
              <p className='text-typo-description text-brand-gray-700'>현재 여행</p>
              {currentPlans.map((plan) => (
                <ScheduleModalItem
                  key={plan.id}
                  plan={plan}
                  selectedScheduleIds={selectedScheduleIds}
                  onSelectSchedule={handleSelectSchedule}
                />
              ))}
            </div>
          )}

          {/* 다가오는 여행 */}
          {upcomingPlans.length > 0 && (
            <div className='flex flex-col gap-[8px]'>
              <p className='text-typo-description text-brand-gray-700'>다가오는 여행</p>
              {upcomingPlans.map((plan) => (
                <ScheduleModalItem
                  key={plan.id}
                  plan={plan}
                  selectedScheduleIds={selectedScheduleIds}
                  onSelectSchedule={handleSelectSchedule}
                />
              ))}
            </div>
          )}

          {/* plan이 없는 경우 */}
          {!isPlansLoading && plans?.length === 0 && (
            <p className='text-typo-description text-brand-gray-400 text-center'>등록된 여행 계획이 없습니다.</p>
          )}
        </div>

        {/* 에러 메시지 */}
        {errorMessage && <p className='text-typo-caption text-tag-red-text text-center'>{errorMessage}</p>}

        {/* 추가하기 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={selectedScheduleIds.size === 0 || isSubmitting}
          className={`absolute bottom-0 left-0 right-0 mx-5 mb-4 py-2 rounded-sm text-typo-base-bold text-center transition-colors ${
            selectedScheduleIds.size > 0 && !isSubmitting
              ? 'bg-brand-blue-700 text-white'
              : 'bg-brand-gray-200 text-brand-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? '추가 중...' : '추가하기'}
        </button>
      </div>
    </div>
  );
}
