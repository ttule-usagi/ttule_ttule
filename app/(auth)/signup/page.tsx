'use client';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import NotePage from '@/components/common/NotePage';
import WithoutLineInput from '@/components/common/WithoutLineInput';
import ProfileImageUploader from '@/components/features/ProfileImageUploader';
import { useConfirmEmailSignup } from '@/hooks/auth/useConfirmEmailSignup';
import { useModalStore } from '@/lib/store/modalStore';

export default function SignUpEmail() {
  const { open } = useModalStore();
  const { confirmEmailSignup, state, handleChange, handleImageChange } = useConfirmEmailSignup();

  return (
    <NotePage title='뚤레뚤레 가입하기'>
      <div className='grid grid-cols-[16rem] grid-rows-[repeat(13,44px)] content-start h-full justify-center items-center relative'>
        <div className='row-span-6 flex justify-center relative'>
          <ProfileImageUploader onUploadImage={handleImageChange} />
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
            text={'회원가입'}
            onClick={confirmEmailSignup}
            disabled={state.loading}
          />
        </div>
      </div>
    </NotePage>
  );
}
