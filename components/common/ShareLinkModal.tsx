'use client';

import { Icon } from '@/components/common/Icon';
import ModalBox from '@/components/common/Modal/ModalBox';

type ShareType = 'VIEW' | 'EDIT';

const MODAL_CONTENT = {
  VIEW: {
    title: '공유 링크 복사',
    description: '공유링크를 통해 접속한 사람은 리스트를 볼 수만 있습니다.',
    inputLabel: '공유 링크',
  },
  EDIT: {
    title: '초대 링크 복사',
    description: '초대링크를 통해 접속한 사람은 리스트를 편집할 수 있습니다.',
    inputLabel: '초대 링크',
  },
};

export default function ShareLinkModal({ type, link }: { type: ShareType; link: string }) {
  const modalText = MODAL_CONTENT[type];
  return (
    <ModalBox>
      <ModalBox.ModalTitle
        title={modalText.title}
        description={modalText.description}
      />
      <div className='flex flex-col gap-1'>
        <p className='text-typo-caption text-brand-gray-400'>{modalText.inputLabel}</p>

        <ModalBox.ModalBottomContent>
          <input
            className='modal-input'
            value={link}
            disabled
          />
          <button className='modal-button px-5'>
            <Icon
              name='Copy'
              size={16}
            />{' '}
            링크 복사
          </button>
        </ModalBox.ModalBottomContent>
      </div>
    </ModalBox>
  );
}
