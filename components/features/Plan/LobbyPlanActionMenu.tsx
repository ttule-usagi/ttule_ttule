'use client';

import { Icon } from '@/components/common/Icon';
import ToggleMenuModal from '@/components/common/ToggleMenuModal';
import { useState } from 'react';

export default function LobbyPlanActionMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='cursor-pointer'
      >
        <Icon
          name='DotsHorizontal'
          size={24}
          className='self-end text-brand-blue-700'
        />
      </button>

      {isOpen && (
        <div className='absolute left-9 top-1.25'>
          <ToggleMenuModal>
            <button className='btn-toggle'>계획 속성 관리</button>
            <button className='btn-toggle'>계획 복제</button>
            <button className='btn-toggle'>계획 삭제</button>
          </ToggleMenuModal>
        </div>
      )}
    </div>
  );
}
