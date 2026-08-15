'use client';

import { usePathname, useRouter } from 'next/navigation';

import { withdraw } from '@/lib/actions/auth';
import { useModalStore } from '@/lib/store/modalStore';

import CancelButton from '../common/CancelButton';
import ConfirmButton from '../common/ConfirmButton';
import { Icon } from '../common/Icon';
import ModalBox from '../common/Modal/ModalBox';

export default function CancelSignupModal() {
  const { close } = useModalStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleCancel = async () => {
    if (pathname.includes('google')) {
      try {
        await withdraw();
        router.replace('/');
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
        } else {
          console.error('탈퇴 오류:', error);
        }
      }
    } else {
      router.replace('/');
    }
    close();
  };

  return (
    <ModalBox
      isCloseIcon={false}
      width={320}
    >
      <div className='w-full flex items-center justify-center -mb-2.5'>
        <div className='w-12 h-12 bg-brand-blue-50 rounded-full flex items-center justify-center'>
          <Icon
            name='AlertCircle'
            size={24}
            className='text-brand-blue-700'
          />
        </div>
      </div>

      <ModalBox.ModalContent>
        <div className='font-light'>
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
