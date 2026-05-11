'use client';

import Link from 'next/link';
import CancelButton from '../common/CancelButton';
import ConfirmButton from '../common/ConfirmButton';
import ModalBox from '../common/Modal/ModalBox';
import { useModalStore } from '@/lib/store/modalStore';

export default function CancelSignupModal() {
  const { close } = useModalStore();

  return (
    <ModalBox
      isCloseIcon={false}
      width={320}
    >
      <ModalBox.ModalContent>
        <div className='pt-8 pb-5'>
          회원가입을 중단하시겠어요? <br />
          지금까지 입력한 내용은 저장되지 않습니다.
        </div>
      </ModalBox.ModalContent>

      <ModalBox.ModalBottomContent>
        <Link href='/'>
          <CancelButton
            text='중단하기'
            onClick={close}
          />
        </Link>
        <ConfirmButton
          text='계속 진행'
          onClick={close}
        />
      </ModalBox.ModalBottomContent>
    </ModalBox>
  );
}
