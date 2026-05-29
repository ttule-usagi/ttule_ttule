'use client';

import { setGoogleAccount } from '@/lib/actions/auth';
import { getProfileImageUrl } from '@/lib/actions/getProfileImageUrl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NotePage from '../common/NotePage';
import ProfileImageUploader from './ProfileImageUploader';
import CancelButton from '../common/CancelButton';
import ConfirmButton from '../common/ConfirmButton';
import { User } from 'next-auth';
import WithoutLineInput from '../common/WithoutLineInput';
import { useModalStore } from '@/lib/store/modalStore';

export default function SignUpWithGoogle({ user }: { user: User }) {
  const router = useRouter();
  const { open } = useModalStore();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [form, setForm] = useState({ nickname: user.name ?? '', profileImage: user.image ?? '' });
  const [errorText, setErrorText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleConfirm = async () => {
    if (!form.nickname.trim()) {
      setErrorText('닉네임을 입력해 주세요.');
      return;
    }

    try {
      const finalImageUrl = profileImage ? await getProfileImageUrl(profileImage) : form.profileImage;
      await setGoogleAccount(form.nickname, finalImageUrl);

      router.push('/lobby');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setErrorText(error.message || '오류가 발생했습니다.');
      } else {
        console.error('알 수 없는 오류:', error);
        setErrorText('알 수 없는 오류가 발생했습니다.');
      }
    }
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
          placeholder='닉네임을 입력해 주세요'
          value={form.nickname}
          onChange={handleChange}
          errorText={errorText}
        />
      </div>

      <div className='flex gap-4 mt-18.25'>
        <CancelButton
          text='취소'
          onClick={() => open({ type: 'cancelSignup' })}
        />
        <ConfirmButton
          text='확인'
          onClick={handleConfirm}
        />
      </div>
    </NotePage>
  );
}
