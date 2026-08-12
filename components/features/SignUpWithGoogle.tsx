'use client';

import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useState } from 'react';

import { useConfirmGoogleSignup } from '@/hooks/user/useConfirmGoogleSignup';
import { useModalStore } from '@/lib/store/modalStore';
import { validateUsername } from '@/lib/utils/validate';

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
    if (!form.nickname.trim()) {
      setFieldError({ field: 'username', message: '닉네임을 입력해 주세요.' });
      return;
    }
    if (!validateUsername(form.nickname)) {
      setFieldError({ field: 'username', message: '닉네임은 공백 없이 2-20자의 한글, 영문, 숫자만 사용 가능합니다.' });
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
      <ProfileImageUploader
        onUploadImage={setProfileImage}
        initialImageURL={form.profileImage}
      />

      <div className='flex flex-col gap-5 font-light text-typo-base mt-7.75'>
        <div className='flex gap-3'>
          <span className='text-brand-blue-700 w-16'>이메일:</span>
          <span className='text-brand-gray-400'>{user.email}</span>
        </div>

        <WithoutLineInput
          id='nickname'
          label='닉네임'
          placeholder='뚤레 닉네임 입력'
          value={form.nickname}
          onChange={handleChange}
          errorText={fieldError?.field === 'username' ? fieldError.message : ''}
        />
      </div>

      <div className='flex gap-4 mt-18.25'>
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
    </NotePage>
  );
}
