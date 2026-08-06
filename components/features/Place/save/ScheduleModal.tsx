'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import ScheduleModalItem from '@/components/features/place/save/ScheduleModalItem';
import { useGetPlanStatus } from '@/hooks/plan/useGetPlanStatus';
import { useGetUserPlans } from '@/hooks/plan/useGetUserPlans';
import { addPlanItemWithTransit } from '@/lib/actions/planItem';
import type { CorePlaceDetail } from '@/types/corePlace';

import BottomButton from './modal-item/BottomButton';
import ModalHeader from './modal-item/ModalHeader';

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

  // 여행 상태에 따라 분류
  const { currentPlans, upcomingPlans, lastPlans } = useGetPlanStatus(plans ?? []);

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

    const results = await Promise.all(
      Array.from(selectedScheduleIds).map((scheduleId) => addPlanItemWithTransit({ scheduleId, placeDetail })),
    );

    setIsSubmitting(false);

    const failedResults = results.filter((r) => !r.success);

    if (failedResults.length > 0) {
      // 실패 케이스별 처리
      const hasUnauthorized = failedResults.some((r) => !r.success && r.error.message === 'UNAUTHORIZED');

      if (hasUnauthorized) {
        setErrorMessage('로그인이 필요합니다.');
        return;
      }

      setErrorMessage('일부 일정에 추가하지 못했습니다. 다시 시도해주세요.');
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ['plan'],
      refetchType: 'active',
    });

    onClose();
  };

  return createPortal(
    <div
      className='modal-overlay'
      onClick={onClose}
    >
      <div
        className='relative bg-white rounded-lg h-[50vh] w-80 flex flex-col px-5 pt-4'
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <ModalHeader
          title='여행 일정에 추가'
          onClose={onClose}
        />

        {/* plan 목록 */}
        <div className='flex flex-col gap-4 max-h-100 overflow-y-auto mt-4'>
          {isPlansLoading && <p className='text-typo-description text-brand-gray-400 text-center'>로딩 중...</p>}

          {/* 현재 여행 */}
          {currentPlans.length > 0 && (
            <div className='flex flex-col gap-2'>
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
            <div className='flex flex-col gap-2'>
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

          {/* 지난 여행 */}
          {lastPlans.length > 0 && (
            <div className='flex flex-col gap-2'>
              <p className='text-typo-description text-brand-gray-700'>지난 여행</p>
              {lastPlans.map((plan) => (
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
        <BottomButton>
          <button
            onClick={handleSubmit}
            disabled={selectedScheduleIds.size === 0 || isSubmitting}
            className={`w-full py-2 rounded-sm text-typo-base-bold text-center transition-colors box-border border ${
              selectedScheduleIds.size > 0 && !isSubmitting
                ? 'bg-brand-blue-700 text-white border-brand-gray-300'
                : 'bg-brand-gray-200 text-brand-gray-400 border-brand-gray-200 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '추가 중...' : '추가하기'}
          </button>
        </BottomButton>
      </div>
    </div>,
    document.body,
  );
}
