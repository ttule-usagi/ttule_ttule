'use client';

import DropDown from '@/components/common/Dropdown';
import { Icon } from '@/components/common/Icon';
import { PlaceItemProps } from './SavedPlaceList';

export default function PlaceListItem({ place }: { place: PlaceItemProps }) {
  return (
    <div className='w-full flex flex-col justify-center wobbly-box'>
      <div className='w-full flex flex-col'>
        <div className='flex items-center h-full text-brand-blue-700'>
          <span className='font-mona12 text-emoji-title mr-2 text-center'>{place.icon}</span>
          <span className='text-typo-sub-title font-medium flex-1'>{place.name}</span>
          <DropDown>
            <DropDown.Trigger>
              <Icon
                name='DotsHorizontal'
                size={32}
              />
            </DropDown.Trigger>
            <DropDown.Menu>
              <DropDown.Item>리스트를 보기 위한 링크 보내기</DropDown.Item>
              <DropDown.Item>수정할 수 있도록 초대</DropDown.Item>
              <DropDown.Item>공유 옵션</DropDown.Item>
              <DropDown.Item>리스트 삭제</DropDown.Item>
            </DropDown.Menu>
          </DropDown>
        </div>

        <div className='flex gap-2 justify-baseline items-center text-typo-description font-light text-brand-gray-400'>
          <span>{place.isShared ? '공유 목록' : '비공개'}</span>
          <span>장소 {place.placeCount}개</span>
        </div>
      </div>
    </div>
  );
}
