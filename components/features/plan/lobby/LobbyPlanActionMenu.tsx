'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { useConfirmDeletePlan } from '@/hooks/plan/useConfirmDeletePlan';
import { useDuplicatePlan } from '@/hooks/plan/useDuplicatePlan';
import { Role } from '@/types/shareOption';

import AuthorityWrapper from '../../AuthorityWrapper';
import PlanSettingModal from '../PlanSettingModal';

interface PlanDropdownMenuProps {
  id: string;
  type?: 'overview' | 'detail';
  planName: string;
  myRole: Role | null;
}

export default function LobbyPlanActionMenu({ planName, type = 'overview', id, myRole }: PlanDropdownMenuProps) {
  const [isSettingModalOpen, setSettingModalOpen] = useState(false);
  const path = usePathname();
  const { confirmDeletePlan } = useConfirmDeletePlan();
  const { mutate: duplicatePlan } = useDuplicatePlan();

  const shouldShowSettingIcon = !path.includes('/plan');
  const isMaster = myRole === 'master';

  return (
    <>
      <AuthorityWrapper
        role={myRole}
        requiredRole='editor'
      >
        <DropDown>
          <DropDown.Trigger>
            {shouldShowSettingIcon ? (
              <Icon
                name='DotsHorizontal'
                size={24}
                className='self-end text-brand-blue-700'
              />
            ) : (
              <div className='hover:bg-brand-blue-50 rounded-full'>
                <Icon
                  name='Setting'
                  size={32}
                  className='text-brand-blue-600'
                />
              </div>
            )}
          </DropDown.Trigger>

          <DropDown.Menu>
            <DropDown.Item onClick={() => setSettingModalOpen(true)}>계획 설정</DropDown.Item>
            {isMaster && <DropDown.Item onClick={() => duplicatePlan(id)}>계획 복제</DropDown.Item>}
            {isMaster && (
              <DropDown.Item onClick={() => confirmDeletePlan(planName, id, type === 'detail')}>
                계획 삭제
              </DropDown.Item>
            )}
          </DropDown.Menu>
        </DropDown>

        {isSettingModalOpen && (
          <PlanSettingModal
            id={id}
            onClose={() => setSettingModalOpen(false)}
          />
        )}
      </AuthorityWrapper>
    </>
  );
}
