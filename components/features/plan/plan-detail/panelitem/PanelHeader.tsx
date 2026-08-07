import { useState } from 'react';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import AuthorityWrapper from '@/components/features/AuthorityWrapper';
import { useClearScheduleItems } from '@/hooks/plan/useClearScheduleItems';
import { useDeletePlanSchedule } from '@/hooks/plan/useDeletePlanSchedule';
import { useReorderPlanSchedule } from '@/hooks/plan/useReorderPlanSchedule';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';
import { PlanInfo, PlanSchedule } from '@/types/plan';
import { Role } from '@/types/shareOption';

import ChangeScheduleModal from '../panelItemDetail/ChangeScheduleModal';

export default function PanelHeader({
  planId,
  plan,
  schedule,
  schedules,
  myRole,
  hasSession,
  isEditingAll,
  isSaving,
  onStartEdit,
  onCancel,
  onSave,
}: {
  planId: string;
  plan: Pick<PlanInfo, 'title' | 'departureDate' | 'arrivalDate'>;
  schedule: PlanSchedule;
  schedules: PlanSchedule[];
  myRole: Role | null;
  hasSession: boolean;
  isEditingAll: boolean;
  isSaving: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const { open } = useModalStore();
  const [isChangingDay, setIsChangingDay] = useState(false);

  const { mutate: clearScheduleItems, isPending: isClearing } = useClearScheduleItems({ planId });
  const { mutate: deletePlanSchedule, isPending: isDeletingDay } = useDeletePlanSchedule({ planId });
  const { mutate: reorderPlanSchedule, isPending: isReordering } = useReorderPlanSchedule({ planId });

  const handleDeleteAllPlanItems = () => {
    clearScheduleItems(schedule.id, {
      onError: (error) => {
        const message =
          error instanceof RpcError
            ? (error.message ??
              getErrorMessage(error.message as RpcErrorMessage, { subject: '일정', action: '초기화' }))
            : getErrorMessage('INTERNAL_ERROR', { subject: '일정', action: '초기화' });

        open({
          type: 'error',
          props: { title: '일정 초기화 실패', description: `${message}\n잠시 후 다시 시도해주세요.` },
        });
      },
    });
  };

  const handleDeleteDayPlan = () => {
    deletePlanSchedule(schedule.id, {
      onError: (error) => {
        const message =
          error instanceof RpcError && error.code === '23505'
            ? '여행 기간은 최소 1일 이상이어야 합니다.'
            : error instanceof RpcError
              ? getErrorMessage(error.message as RpcErrorMessage, { subject: '계획', action: '삭제' })
              : getErrorMessage('INTERNAL_ERROR', { subject: '계획', action: '삭제' });

        open({
          type: 'error',
          props: { title: '일정표 삭제 실패', description: `${message}` },
        });
      },
    });
  };

  function formatScheduleDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}.${day}(${weekday})`;
  }

  function handleOpenChangeDay() {
    if (schedules.length === 1) {
      open({
        type: 'error',
        props: {
          title: '날짜 변경 불가',
          description: `여행 기간이 너무 짧습니다. \n 설정에서 여행 기간을 늘려주세요.`,
        },
      });
    } else {
      setIsChangingDay(true);
    }
  }

  const dateStr = formatScheduleDate(schedule.scheduleDate);
  const dateNumber = schedule.dayNumber;

  return (
    <div className='flex-none flex items-start justify-between mt-6 mx-5 z-10'>
      <div className='flex flex-col items-start'>
        <div className='flex items-center gap-2'>
          <p className='text-white font-semibold text-typo-title leading-8 tracking-[-0.72px]'>{dateNumber}일차</p>
          {isEditingAll && (
            <p className='text-white text-typo-title leading-8 tracking-[-0.72px] font-normal'>편집모드</p>
          )}
        </div>
        {dateStr && <p className='text-white text-typo-base'>{dateStr}</p>}
      </div>

      {hasSession && (
        <AuthorityWrapper
          role={myRole}
          requiredRole='editor'
        >
          <div className='flex gap-3 items-center'>
            {isEditingAll ? (
              <div className='flex gap-4 items-center'>
                <button
                  className='text-white text-typo-base'
                  onClick={onCancel}
                >
                  취소
                </button>
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className='text-brand-blue-700 text-typo-base-bold bg-white px-3 py-2 rounded-sm ml-2'
                >
                  {isSaving ? '저장 중...' : '저장하기'}
                </button>
              </div>
            ) : (
              <div className='flex gap-3 items-center'>
                <button
                  onClick={onStartEdit}
                  className='text-white text-typo-base'
                >
                  편집
                </button>

                <DropDown>
                  <DropDown.Trigger>
                    <Icon
                      name='DotsHorizontal'
                      size={32}
                      className='text-white'
                    />
                  </DropDown.Trigger>

                  <DropDown.Menu>
                    <DropDown.Item onClick={onStartEdit}>일정 편집</DropDown.Item>

                    <DropDown.Item onClick={handleOpenChangeDay}>날짜 변경</DropDown.Item>

                    <DropDown.Item
                      onClick={() =>
                        open({
                          type: 'deletePlanDate',
                          props: {
                            onConfirm: handleDeleteAllPlanItems,
                            dayNumber: dateNumber,
                            type: 'deleteAllPlanItems',
                          },
                        })
                      }
                      disabled={isClearing}
                    >
                      일정 초기화
                    </DropDown.Item>
                    <DropDown.Item
                      onClick={() =>
                        open({
                          type: 'deletePlanDate',
                          props: { onConfirm: handleDeleteDayPlan, dayNumber: dateNumber, type: 'deleteDayPlan' },
                        })
                      }
                      disabled={isDeletingDay}
                    >
                      일정표 삭제
                    </DropDown.Item>
                  </DropDown.Menu>
                </DropDown>
              </div>
            )}
          </div>
        </AuthorityWrapper>
      )}

      {isChangingDay && (
        <ChangeScheduleModal
          title='일정표 날짜 변경'
          confirmLabel='이동하기'
          plan={plan}
          schedules={schedules}
          currentScheduleId={schedule.id}
          onClose={() => setIsChangingDay(false)}
          onConfirm={(targetScheduleId) => {
            const targetDayNumber = schedules.find((s) => s.id === targetScheduleId)?.dayNumber;
            if (targetDayNumber === undefined) return;

            reorderPlanSchedule(
              { scheduleId: schedule.id, newDayNumber: targetDayNumber },
              {
                onSuccess: (result) => {
                  if (result.success) setIsChangingDay(false);
                },
              },
            );
          }}
          isSubmitting={isReordering}
        />
      )}
    </div>
  );
}
