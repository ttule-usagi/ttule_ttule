import { Icon } from '@/components/common/Icon';
import AuthorityWrapper from '@/components/features/AuthorityWrapper';
import { PlanSchedule } from '@/types/plan';
import { Role } from '@/types/shareOption';

export default function PanelHeader({
  schedule,
  myRole,
  hasSession,
  isEditingAll,
  isSaving,
  onStartEdit,
  onCancel,
  onSave,
}: {
  schedule: PlanSchedule;
  myRole: Role | null;
  hasSession: boolean;
  isEditingAll: boolean;
  isSaving: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  function formatScheduleDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}.${day}(${weekday})`;
  }

  const dateStr = formatScheduleDate(schedule.scheduleDate);
  return (
    <div className='flex-none flex items-start justify-between mt-6 mx-5 z-10'>
      <div className='flex flex-col items-start'>
        <div className='flex items-center gap-2'>
          <p className='text-white font-semibold text-typo-title leading-8 tracking-[-0.72px]'>
            {schedule.dayNumber}일차
          </p>
          {isEditingAll && (
            <p className='text-white text-typo-title leading-8 tracking-[-0.72px] font-normal'>편집모드</p>
          )}
        </div>
        {dateStr && <p className='text-white text-typo-base'>{dateStr}</p>}
      </div>

      {/* 편집/더보기 버튼 */}
      {hasSession && (
        <AuthorityWrapper
          role={myRole}
          requiredRole='editor'
        >
          {' '}
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
                <Icon
                  name='DotsHorizontal'
                  size={32}
                  className='text-white'
                />{' '}
              </div>
            )}
          </div>
        </AuthorityWrapper>
      )}
    </div>
  );
}
