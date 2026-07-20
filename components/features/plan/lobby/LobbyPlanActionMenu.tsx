'use client';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { useState } from 'react';
import PlanSettingModal from '../PlanSettingModal';

export default function LobbyPlanActionMenu({ id }: { id: string }) {
  const [isSettingModalOpen, setSettingModalOpen] = useState(false);

  return (
    <>
      <DropDown>
        <DropDown.Trigger>
          <Icon
            name='DotsHorizontal'
            size={24}
            className='self-end text-brand-blue-700'
          />
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
