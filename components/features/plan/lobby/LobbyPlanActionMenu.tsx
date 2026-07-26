'use client';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { useState } from 'react';
import PlanSettingModal from '../PlanSettingModal';
import { usePathname } from 'next/navigation';

export default function LobbyPlanActionMenu({ id }: { id: string }) {
  const [isSettingModalOpen, setSettingModalOpen] = useState(false);
  const path = usePathname();

  const shouldShowSettingIcon = !path.includes('/plan');

  return (
    <>
      <DropDown>
        <DropDown.Trigger>
          {shouldShowSettingIcon ? (
            <Icon
              name='DotsHorizontal'
              size={24}
              className='self-end text-brand-blue-700'
            />
          ) : (
            <Icon
              name='Setting'
              size={32}
              className='text-brand-blue-600'
            />
          )}
        </DropDown.Trigger>

        <DropDown.Menu>
          <DropDown.Item onClick={() => setSettingModalOpen(true)}>계획 속성 관리</DropDown.Item>
          <DropDown.Item>계획 복제</DropDown.Item>
          <DropDown.Item onClick={() => console.log(`계획 ${id} 삭제`)}>계획 삭제</DropDown.Item>
        </DropDown.Menu>
      </DropDown>

      {isSettingModalOpen && (
        <PlanSettingModal
          id={id}
          onClose={() => setSettingModalOpen(false)}
        />
      )}
    </>
  );
}
