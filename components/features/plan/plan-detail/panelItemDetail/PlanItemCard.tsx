'use client';

import { useQueryClient } from '@tanstack/react-query';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import AuthorityWrapper from '@/components/features/AuthorityWrapper';
import { duplicatePlanItem, deletePlanItem } from '@/lib/actions/planItem';
import { useModalStore } from '@/lib/store/modalStore';
import { getPlaceCategoryLabel } from '@/lib/utils/categoryLabel';
import { getGoogleLink } from '@/lib/utils/getExternalLink';
import { CATEGORY_COLORS, CATEGORY_EMOJI } from '@/lib/utils/placeCategory';
import type { PlaceCategory } from '@/types/corePlace';
import { PlanItem } from '@/types/plan';
import { Role } from '@/types/shareOption';

import NotchRows from './NotchRows';
import PlanDetailMemoContent from './PlanDetailMemoContent';

interface PlanItemCardProps {
  item: PlanItem;
  onClick: () => void;
  onOpenDetail: () => void;
  onChangeSchedule: () => void;
  onOpenRouteModal: () => void;
  hasSession: boolean;
  myRole: Role | null;
  hasNextPlaceItem: boolean;
}

function CategoryIcon({ category }: { category: string | null }) {
  const color = category ? (CATEGORY_COLORS[category as PlaceCategory] ?? '#C0C8E0') : '#C0C8E0';
  const emoji = category ? (CATEGORY_EMOJI[category as PlaceCategory] ?? '📍') : '📍';

  return (
    <div
      className='flex items-center justify-center rounded-full size-[26px] shrink-0'
      style={{ backgroundColor: color }}
    >
      <span className='font-mona12 text-emoji-sm pl-0.5 pb-0.5'>{emoji}</span>
    </div>
  );
}

function formatVisitTime(time: string | null): string {
  if (!time) return '';
  return time.slice(0, 5); // "HH:MM"
}

export default function PlanItemCard({
  item,
  onClick,
  onOpenDetail,
  onChangeSchedule,
  onOpenRouteModal,
  hasSession,
  myRole,
  hasNextPlaceItem,
}: PlanItemCardProps) {
  const { open } = useModalStore();
  const queryClient = useQueryClient();

  const categoryLabel = item.placeCategory ? getPlaceCategoryLabel(item.placeCategory) : null;

  const handleDuplicate = async () => {
    const result = await duplicatePlanItem(item);
    if (result.success) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('items') && query.queryKey.includes(item.scheduleId),
        refetchType: 'active',
      });
    }
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
    <div className='relative bg-white rounded-2 shadow-lg  overflow-hidden rounded-sm'>
      <NotchRows />
      {/* 왼쪽 색상 바- 추후 가장 최근 수정된 컴포넌트 표기 적용예정 */}
      {/* <div
        className='absolute left-0 top-0 bottom-0 w-[8px]'
        style={{
          backgroundColor: item.placeCategory
            ? (CATEGORY_COLORS[item.placeCategory as PlaceCategory] ?? '#C0C8E0')
            : '#C0C8E0',
        }}
      /> */}

      <div className='pl-4 pr-4 py-4 flex gap-2 items-start'>
        {/* 카테고리 아이콘 + 방문 시간 */}
        <div className='flex flex-col gap-0.5 items-center w-7 shrink-0 mt-1'>
          <CategoryIcon category={item.placeCategory} />
          {item.visitTime && (
            <p className='text-typo-caption text-brand-gray-400 whitespace-nowrap'>{formatVisitTime(item.visitTime)}</p>
          )}
        </div>

        {/* 장소 정보 */}
        <div className='flex flex-col gap-2 flex-1 min-w-0'>
          <div
            className='flex flex-col items-start'
            onClick={onOpenDetail}
          >
            <p className='text-typo-base-bold xl:text-typo-sub-title text-brand-blue-700 w-full cursor-pointer'>
              {item.placeName}
            </p>
            {categoryLabel && <p className='text-typo-description text-brand-gray-400'>{categoryLabel}</p>}
          </div>
          {item.memoContent && (
            <div className='text-typo-description xl:text-typo-base text-brand-gray-600 whitespace-pre-wrap'>
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
                  className='text-brand-gray-400'
                />
              </DropDown.Trigger>

              {/* 실제로 열릴 드롭다운 메뉴 */}
              <DropDown.Menu>
                <DropDown.Item onClick={onClick}>일정 편집</DropDown.Item>
                {hasNextPlaceItem && <DropDown.Item onClick={onOpenRouteModal}>이동 정보 관리</DropDown.Item>}
                <DropDown.Item>
                  {' '}
                  <a
                    href={getGoogleLink(item.googlePlaceId)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block w-full'
                  >
                    구글 지도에서 보기
                  </a>
                </DropDown.Item>

                <DropDown.Item onClick={onChangeSchedule}>다른 날짜로 변경</DropDown.Item>
                <hr className='border-brand-gray-200' />
                <DropDown.Item onClick={handleDuplicate}>일정 복제</DropDown.Item>

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
