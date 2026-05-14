'use client';

import CancelButton from '../common/CancelButton';
import ConfirmButton from '../common/ConfirmButton';
import ModalBox from '../common/Modal/ModalBox';
import { useModalStore } from '@/lib/store/modalStore';
import { usePathname, useRouter } from 'next/navigation';

export default function CancelSignupModal() {
  const { close } = useModalStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleCancel = async () => {
    if (pathname.includes('google')) {
      // 구글 가입 중단 시, 회원탈퇴 후 홈으로 이동
    } else {
      router.push('/');
    }
    close();
  };

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
        <CancelButton
          text='중단하기'
          onClick={handleCancel}
        />
        <ConfirmButton
          text='계속 진행'
          onClick={close}
        />
      </ModalBox.ModalBottomContent>
    </ModalBox>
  );
}
