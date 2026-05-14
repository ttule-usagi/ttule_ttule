'use client';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import NotePage from '@/components/common/NotePage';
import ProfileImageUploader from '@/components/features/ProfileImageUploader';
import { signUpWithEmail } from '@/lib/actions/auth';
import { AuthError } from '@/types/errors';
import WithoutLineInput from '@/components/common/WithoutLineInput';
import { useSignupForm } from '@/hooks/useSignupForm';
import { useModalStore } from '@/lib/store/modalStore';
import { useState } from 'react';
import { getProfileImageUrl } from '@/lib/actions/getProfileImageUrl';

const initialState = {
  email: '',
  password: '',
  username: '',
  error: { field: '', message: '' },
  loading: false,
};

export default function SignUpEmail() {
  const { open } = useModalStore();
  const { state, dispatch, handleChange } = useSignupForm(initialState);

  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    dispatch({ type: 'SET_ERROR', error: { field: '', message: '' } });
    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      const finalImageUrl = profileImage ? await getProfileImageUrl(profileImage) : '';

      await signUpWithEmail({
        email: state.email,
        password: state.password,
        username: state.username,
        profile_image_url: finalImageUrl,
      });
    } catch (e: unknown) {
      if (e instanceof AuthError) {
        dispatch({ type: 'SET_ERROR', error: { field: e.field, message: e.message } });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  return (
    <NotePage title='뚤레뚤레 가입하기'>
      <ProfileImageUploader onUploadImage={setProfileImage} />

      <div className='flex flex-col gap-5 font-light text-typo-base mt-7.75'>
        <WithoutLineInput
          id='email'
          label='이메일'
          placeholder='이메일을 입력해주세요'
          value={state.email}
          onChange={(e) => handleChange(e)}
          errorText={state.error?.field === 'email' ? state.error.message : ''}
        />
        <WithoutLineInput
          id='password'
          type='password'
          label='비밀번호'
          placeholder='비밀번호를 입력해주세요'
          value={state.password}
          onChange={(e) => handleChange(e)}
          errorText={state.error?.field === 'password' ? state.error.message : ''}
        />
        <WithoutLineInput
          id='username'
          label='닉네임'
          placeholder='여행자#1522'
          value={state.username}
          onChange={(e) => handleChange(e)}
          errorText={state.error?.field === 'username' ? state.error.message : ''}
        />
        {state.error?.field === 'general' && (
          <p className='text-left w-full mt-1 text-typo-description text-red-500'>{state.error.message}</p>
        )}
      </div>

      <div className='flex gap-4 mt-18.25'>
        <CancelButton
          text='취소'
          onClick={() => open('cancelSignup')}
        />
        <ConfirmButton
          text={state.loading ? '가입 중...' : '회원가입'}
          onClick={handleSubmit}
          disabled={state.loading}
        />
      </div>
    </NotePage>
  );
}
