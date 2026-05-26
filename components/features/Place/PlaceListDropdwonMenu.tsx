'use client';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';

export default function PlaceListDropdownMenu() {
  return (
    <DropDown>
      <DropDown.Trigger>
        <Icon
          name='DotsHorizontal'
          size={32}
          className='cursor-pointer'
        />
      </DropDown.Trigger>

      <DropDown.Menu>
        <DropDown.Item>리스트를 보기 위한 링크 보내기</DropDown.Item>
        <DropDown.Item>수정할 수 있도록 초대</DropDown.Item>
        <DropDown.Item>공유 옵션 관리</DropDown.Item>
        <DropDown.Item>리스트 편집</DropDown.Item>
        <DropDown.Item>리스트 삭제</DropDown.Item>
      </DropDown.Menu>
    </DropDown>
  );
}
