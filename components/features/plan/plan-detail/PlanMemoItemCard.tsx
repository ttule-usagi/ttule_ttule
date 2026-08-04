'use client';

import { useQueryClient } from '@tanstack/react-query';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { useAddPlanMemoItem } from '@/hooks/plan/useAddPlanMemoItem';
import { deletePlanItem } from '@/lib/actions/planItem';
import { useModalStore } from '@/lib/store/modalStore';
import type { PlanItem } from '@/types/plan';
import { Role } from '@/types/shareOption';

import AuthorityWrapper from '../../AuthorityWrapper';
import NotchRows from '../NotchRows';

import PlanDetailMemoContent from './PlanDetailMemoContent';

interface PlanMemoItemCardProps {
  item: PlanItem;
  onClick: () => void;
  onChangeSchedule: () => void;
  hasSession: boolean;
  myRole: Role | null;
}

function formatVisitTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5);
}

export default function PlanMemoItemCard({
  item,
  onClick,
  onChangeSchedule,
  hasSession,
  myRole,
}: PlanMemoItemCardProps) {
  const queryClient = useQueryClient();
  const { addMemoItem } = useAddPlanMemoItem();
  const { open } = useModalStore();

  const handleDuplicate = async () => {
    await addMemoItem({
      scheduleId: item.scheduleId,
      placeName: item.placeName,
      memoContent: item.memoContent,
      visitTime: item.visitTime,
    });
  };

  const handleDelete = async () => {
    const result = await deletePlanItem(item.id);

    if (result.success) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('items') && query.queryKey.includes(item.scheduleId),
        refetchType: 'active',
      });
    }
  };

  return (
    <div className='relative flex bg-white shadow-sm cursor-pointer w-full rounded-sm'>
      <NotchRows count={1} />
      {/* 왼쪽 방문 시간 */}
      {item.visitTime && (
        <p className='absolute left-4 top-5 text-typo-caption text-brand-gray-400 whitespace-nowrap'>
          {formatVisitTime(item.visitTime)}
        </p>
      )}
      <div className='flex flex-1 flex-row pl-13 py-4 gap-2 items-start'>
        <div className='flex-1 flex flex-col gap-2 w-full'>
          {/* 제목 */}
          <p className='text-typo-base-bold xl:text-typo-sub-title text-brand-blue-700 whitespace-nowrap'>
            {item.placeName}
          </p>

          {/* 메모 */}
          {item.memoContent && (
            <div className='text-typo-description xl:text-typo-base text-brand-gray-500 whitespace-pre-line whitespace-pre-wrap'>
              <PlanDetailMemoContent content={item.memoContent} />
            </div>
          )}
        </div>

        {/* 더보기 버튼 */}
        {hasSession && (
          <AuthorityWrapper
            role={myRole}
            requiredRole='editor'
          >
            <DropDown>
              {/* 트리거는 드롭다운 메뉴를 열고 닫을 버튼이 되는 것 */}
              <DropDown.Trigger>
                <Icon
                  name='DotsHorizontal'
                  size={24}
                  className='text-brand-gray-400 mr-4'
                />
              </DropDown.Trigger>

              {/* 실제로 열릴 드롭다운 메뉴 */}
              <DropDown.Menu>
                <DropDown.Item onClick={onClick}>일정 편집</DropDown.Item>
                <DropDown.Item onClick={handleDuplicate}>일정 복제</DropDown.Item>
                <DropDown.Item onClick={onChangeSchedule}>다른 날짜로 변경</DropDown.Item>
                <DropDown.Item
                  onClick={() =>
                    open({
                      type: 'deletePlanItem',
                      props: { onConfirm: handleDelete },
                    })
                  }
                >
                  일정 삭제
                </DropDown.Item>
              </DropDown.Menu>
            </DropDown>
          </AuthorityWrapper>
        )}
      </div>
    </div>
  );
}
