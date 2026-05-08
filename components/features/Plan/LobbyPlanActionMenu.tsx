'use client';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';

export default function LobbyPlanActionMenu({ id }: { id?: number }) {
  return (
    <DropDown>
      <DropDown.Trigger>
        <Icon
          name='DotsHorizontal'
          size={24}
          className='self-end text-brand-blue-700'
        />
      </DropDown.Trigger>

      <DropDown.Menu>
        <DropDown.Item>계획 속성 관리</DropDown.Item>
        <DropDown.Item>계획 복제</DropDown.Item>
        <DropDown.Item onClick={() => console.log(`계획 ${id} 삭제`)}>계획 삭제</DropDown.Item>
      </DropDown.Menu>
    </DropDown>
  );
}
