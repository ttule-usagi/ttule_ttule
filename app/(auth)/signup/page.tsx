'use client';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useState } from 'react';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import NotePage from '@/components/common/NotePage';
import WithoutLineInput from '@/components/common/WithoutLineInput';
import ProfileImageUploader from '@/components/features/ProfileImageUploader';
import { useSignupForm } from '@/hooks/useSignupForm';
import { signUpAction } from '@/lib/actions/auth';
import { getProfileImageUrl } from '@/lib/actions/getProfileImageUrl';
import { useModalStore } from '@/lib/store/modalStore';
import { getErrorMessage } from '@/types/errors';

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
      let finalImageUrl = '';

      if (profileImage) {
        try {
          finalImageUrl = await getProfileImageUrl(profileImage);
        } catch (uploadError) {
          console.error('❌ 이미지 업로드 실패:', uploadError);
          dispatch({
            type: 'SET_ERROR',
            error: { field: 'image', message: '이미지 파일을 다시 확인해주세요.' },
          });
          return; // 회원가입 자체를 진행하지 않고 여기서 종료
        }
      }

      const result = await signUpAction({
        email: state.email,
        password: state.password,
        username: state.username,
        profileImageUrl: finalImageUrl,
      });

      if (!result.success) {
        dispatch({
          type: 'SET_ERROR',
          error: {
            field: result.error.field ?? '',
            message: result.error.detail ?? getErrorMessage(result.error.message, { subject: '회원', action: '가입' }),
          },
        });
      }
    } catch (error) {
      // 리다이렉트 신호는 그대로 다시 던져서 Next.js가 정상 처리하도록 둠
      if (isRedirectError(error)) {
        throw error;
      }

      console.error('❌ 회원가입 처리 중 오류:', error);
      dispatch({
        type: 'SET_ERROR',
        error: { field: '', message: '처리 중 오류가 발생했습니다. 다시 시도해주세요.' },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  return (
    <NotePage title='뚤레뚤레 가입하기'>
      <div className='grid grid-cols-[16rem] grid-rows-[repeat(13,44px)] content-start h-full justify-center items-center relative'>
        <div className='row-span-6 flex justify-center relative'>
          <ProfileImageUploader onUploadImage={setProfileImage} />
          {state.error?.field === 'image' && (
            <p className='absolute left-0 -bottom-7 text-typo-caption text-tag-red-text whitespace-nowrap bg-white/70'>
              {state.error.message}
            </p>
          )}
        </div>

        <div className='relative flex flex-col w-full justify-self-stretch'>
          <WithoutLineInput
            id='email'
            label='이메일'
            placeholder='이메일을 입력해주세요'
            value={state.email}
            onChange={(e) => handleChange(e)}
          />
          {state.error?.field === 'email' && (
            <p className='absolute left-0 top-full -mt-1.5 text-typo-caption text-tag-red-text whitespace-nowrap bg-white/70'>
              {state.error.message}
            </p>
          )}
        </div>

        <div className='relative flex flex-col w-full justify-self-stretch'>
          <WithoutLineInput
            id='password'
            type='password'
            label='비밀번호'
            placeholder='비밀번호를 입력해주세요'
            value={state.password}
            onChange={(e) => handleChange(e)}
          />
          {state.error?.field === 'password' && (
            <p className='absolute left-0 top-full -mt-1.5 text-typo-caption text-tag-red-text whitespace-nowrap bg-white/70'>
              {state.error.message}
            </p>
          )}
        </div>

        <div className='relative flex flex-col w-full justify-self-stretch'>
          <WithoutLineInput
            id='username'
            label='닉네임'
            maxLength={9}
            placeholder='뚤레 닉네임 입력'
            value={state.username}
            onChange={(e) => handleChange(e)}
          />
          {state.error?.field === 'username' && (
            <p className='absolute left-0 top-full -mt-1.5 text-typo-caption text-tag-red-text whitespace-nowrap bg-white/70'>
              {state.error.message}
            </p>
          )}
        </div>

        <p className='text-left text-typo-caption text-tag-red-text min-h-4.5 -mr-11 justify-self-stretch'>
          {!state.error?.field && state.error.message}
        </p>

        <div className='row-span-2 w-full flex gap-4 justify-self-stretch'>
          <CancelButton
            text='취소'
            onClick={() => open({ type: 'cancelSignup' })}
          />
          <ConfirmButton
            text={state.loading ? '가입 중...' : '회원가입'}
            onClick={handleSubmit}
            disabled={state.loading}
          />
        </div>
      </div>
    </NotePage>
  );
}
