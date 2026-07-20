'use client';

import { ResourceType } from '@/types/invite';
import { PrivateButton, PublicButton } from './publicSelector/SetPublicButton';
import { useGetPlaceListIsPublic, useGetPlanIsPublic } from '@/hooks/shareOption/useGetPublicState';

interface PublicStateSelectorProps {
  id: string;
  resourceType: ResourceType;
  disabled: boolean;
}

export function PublicStateSelector({ id, resourceType, disabled }: PublicStateSelectorProps) {
  // resourceType에 따라 해당하는 selector를 렌더링
  return (
    <div className='flex flex-col gap-2'>
      {resourceType === 'plan' ? (
        <PlanPublicStateSelector
          planId={id}
          disabled={disabled}
        />
      ) : (
        <PlaceListPublicStateSelector
          placeListId={id}
          disabled={disabled}
        />
      )}
      <p className='text-typo-description text-brand-gray-600 h-6 font-light'>
        공개 여부는 소유자만 설정할 수 있습니다.
      </p>
    </div>
  );
}

// 계획 공개/비공개 설정 버튼
function PlanPublicStateSelector({ planId, disabled }: { planId: string; disabled?: boolean }) {
  const { data: isPublic } = useGetPlanIsPublic(planId); // 지난번 만든 훅

  return (
    <div className='flex gap-2'>
      <PublicButton
        id={planId}
        resourceType='plan'
        isSelected={isPublic}
        disabled={disabled}
      />
      <PrivateButton
        id={planId}
        resourceType='plan'
        isSelected={!isPublic}
        disabled={disabled}
      />
    </div>
  );
}

// 장소 리스트 공개/비공개 설정 버튼
function PlaceListPublicStateSelector({ placeListId, disabled }: { placeListId: string; disabled?: boolean }) {
  const { data: isPublic } = useGetPlaceListIsPublic(placeListId);

  return (
    <div className='flex gap-2'>
      <PublicButton
        id={placeListId}
        resourceType='place_list'
        isSelected={isPublic}
        disabled={disabled}
      />
      <PrivateButton
        id={placeListId}
        resourceType='place_list'
        isSelected={!isPublic}
        disabled={disabled}
      />
    </div>
  );
}
