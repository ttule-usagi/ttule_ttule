'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '@/components/common/Icon';
import ModalHeader from '@/components/features/place/save/modal-item/ModalHeader';
import type { PlanInfo, PlanSchedule } from '@/types/plan';

interface ChangeScheduleModalProps {
  plan: Pick<PlanInfo, 'title' | 'departureDate' | 'arrivalDate'>;
  schedules: PlanSchedule[];
  currentScheduleId: string;
  onClose: () => void;
  onConfirm: (targetScheduleId: string) => void;
  isSubmitting?: boolean;
  title?: string;
  confirmLabel?: string;
}

function formatDateRange(departureDate: string | null, arrivalDate: string | null): string {
  if (!departureDate || !arrivalDate) return '';
  const start = new Date(departureDate);
  const end = new Date(arrivalDate);
  const startStr = `${start.getFullYear()}.${start.getMonth() + 1}.${start.getDate()}`;
  const endStr = `${end.getMonth() + 1}.${end.getDate()}`;
  return `${startStr} - ${endStr}`;
}

export default function ChangeScheduleModal({
  plan,
  schedules,
  currentScheduleId,
  onClose,
  onConfirm,
  isSubmitting,
  confirmLabel = '변경하기',
}: ChangeScheduleModalProps) {
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedScheduleId) return;
    onConfirm(selectedScheduleId);
  };

  return createPortal(
    <div
      className='modal-overlay'
      onClick={onClose}
    >
      <div
        className='relative bg-white rounded-sm w-80 flex flex-col gap-4 px-5 py-4'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col gap-4 items-center w-full'>
          <ModalHeader
            title='일정표 날짜 변경'
            onClose={onClose}
          />

          <div className='bg-brand-gray-50 flex flex-col gap-2 items-start px-3 py-2 w-full'>
            <div className='flex flex-col w-full'>
              <p className='text-typo-base text-brand-gray-700 w-full'>{plan.title}</p>
              <p className='text-typo-caption text-brand-gray-500 w-full'>
                {formatDateRange(plan.departureDate, plan.arrivalDate)}
              </p>
            </div>

            <div className='flex gap-2 items-start flex-wrap'>
              {schedules
                .filter((schedule) => schedule.id !== currentScheduleId)
                .map((schedule) => {
                  const isSelected = selectedScheduleId === schedule.id;
                  return (
                    <button
                      key={schedule.id}
                      onClick={() => setSelectedScheduleId(schedule.id)}
                      className={
                        isSelected
                          ? 'bg-brand-blue-50 border border-brand-blue-100 flex gap-1 items-center justify-center px-3 py-1.75 rounded-sm hover:border-brand-blue-400'
                          : 'bg-white border border-brand-gray-300 flex gap-1 items-center justify-center px-2.5 py-1.75 rounded-sm hover:bg-brand-gray-50'
                      }
                    >
                      {isSelected && (
                        <Icon
                          name='Check'
                          size={18}
                          className='text-brand-blue-500'
                        />
                      )}
                      <span
                        className={
                          isSelected
                            ? 'text-typo-description text-brand-blue-500 whitespace-nowrap'
                            : 'text-typo-description text-brand-gray-500 whitespace-nowrap'
                        }
                      >
                        {schedule.dayNumber}일차
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedScheduleId || isSubmitting}
          className={`w-full py-2 rounded-xs text-typo-base-bold text-center border ${
            selectedScheduleId && !isSubmitting
              ? 'bg-brand-blue-700 text-white border-brand-gray-300 hover:bg-brand-blue-800'
              : 'bg-brand-gray-200 text-brand-gray-400 border-brand-gray-200 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? '변경 중...' : (confirmLabel ?? '변경하기')}
        </button>
      </div>
    </div>,
    document.body,
  );
}
