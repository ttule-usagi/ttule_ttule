'use client';

import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useState } from 'react';

import { useConfirmGoogleSignup } from '@/hooks/user/useConfirmGoogleSignup';
import { useModalStore } from '@/lib/store/modalStore';
import { getUsernameErrorMessage } from '@/lib/utils/validate';

import CancelButton from '../common/CancelButton';
import ConfirmButton from '../common/ConfirmButton';
import NotePage from '../common/NotePage';
import WithoutLineInput from '../common/WithoutLineInput';

import ProfileImageUploader from './ProfileImageUploader';

export default function SignUpWithGoogle({ user }: { user: User }) {
  const router = useRouter();
  const { open } = useModalStore();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [form, setForm] = useState({ nickname: user.name ?? '', profileImage: user.image ?? '' });
  const { confirmGoogleSignup, isPending, fieldError, setFieldError } = useConfirmGoogleSignup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleConfirm = () => {
    // 먼저 유효성 검사 후 확인모달 노출
    const usernameError = getUsernameErrorMessage(form.nickname);
    if (usernameError) {
      setFieldError({
        field: 'username',
        message: usernameError,
      });
      return;
    }

    confirmGoogleSignup({
      email: user.email ?? '',
      username: form.nickname,
      newProfileImage: profileImage,
      currentProfileImage: form.profileImage ?? '',
      onSuccess: () => router.replace('/lobby'),
    });
  };

  return (
    <NotePage title='뚤레뚤레 가입하기'>
      <div className='grid grid-cols-[16rem] grid-rows-[repeat(13,44px)] content-start h-full justify-center items-center relative'>
        <div className='row-span-6 flex justify-center relative'>
          <ProfileImageUploader
            onUploadImage={setProfileImage}
            initialImageURL={form.profileImage}
          />
          {fieldError?.field === 'image' && (
            <p className='absolute left-0 -bottom-7 text-typo-caption text-tag-red-text whitespace-nowrap bg-white/70'>
              {fieldError.message}
            </p>
          )}
        </div>

        <div className='w-full flex gap-3 text-typo-base font-light justify-self-stretch items-start'>
          <span className='text-brand-blue-700 shrink-0'>이메일:</span>
          <p className='flex-1 min-w-0 max-h-6 text-brand-gray-400 truncate'>{user.email}</p>
        </div>

        <div className='flex flex-col w-full justify-self-stretch'>
          <WithoutLineInput
            id='nickname'
            label='닉네임'
            placeholder='뚤레 닉네임 입력'
            value={form.nickname}
            onChange={handleChange}
            maxLength={9}
          />
        </div>
        <p className='text-left text-typo-caption text-tag-red-text min-h-4.5 -mt-3 -mr-11'>
          {fieldError?.field !== 'image' && fieldError?.message}
        </p>

        <div className='row-span-5 w-full flex gap-4 justify-self-stretch'>
          <CancelButton
            text='취소'
            onClick={() => open({ type: 'cancelSignup' })}
            disabled={isPending}
          />
          <ConfirmButton
            text={isPending ? '가입중...' : '확인'}
            onClick={handleConfirm}
            disabled={isPending}
          />
        </div>
      </div>
    </NotePage>
  );
}
