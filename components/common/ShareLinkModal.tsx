'use client';

import { Icon } from '@/components/common/Icon';
import ModalBox from '@/components/common/Modal/ModalBox';
import { useState } from 'react';

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
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('복사 실패', error);
      setErrorText('복사에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setTimeout(() => setErrorText(null), 2000);
    }
  };

  return (
    <ModalBox width={560}>
      <ModalBox.ModalTitle
        title={modalText.title}
        description={modalText.description}
      />
      <div className='flex flex-col gap-1'>
        <p className='text-typo-caption text-brand-gray-400'>{modalText.inputLabel}</p>

        <ModalBox.ModalBottomContent>
          <input
            className='modal-input min-w-0'
            value={link}
            disabled
          />
          <button
            className='modal-button px-5 shrink-0 min-w-30.25'
            onClick={handleCopy}
          >
            {!isCopied ? (
              <>
                <Icon
                  name='Copy'
                  size={16}
                />{' '}
                링크 복사
              </>
            ) : (
              '복사 성공 !'
            )}
          </button>
          {errorText && <div>{errorText}</div>}
        </ModalBox.ModalBottomContent>
      </div>
    </ModalBox>
  );
}
