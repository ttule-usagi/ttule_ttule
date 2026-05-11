'use client';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import NotePage from '@/components/common/NotePage';
import ProfileImageUploader from '@/components/features/ProfileImageUploader';
import { signUpWithEmail } from '@/lib/api/auth';
import WithoutLineInput from '@/components/common/WithoutLineInput';
import { useAuthForm } from '@/hooks/useAuthForm';

const initialState = {
  email: '',
  password: '',
  username: '',
  error: '',
  loading: false,
};

export default function SignUpEmail() {
  const { state, dispatch, handleChange } = useAuthForm(initialState);

  const handleSubmit = async () => {
    dispatch({ type: 'SET_ERROR', error: '' });
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      await signUpWithEmail({
        email: state.email,
        password: state.password,
        username: state.username,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        dispatch({ type: 'SET_ERROR', error: e.message });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  return (
    <NotePage title='뚤레뚤레 가입하기'>
      <ProfileImageUploader />

      <div className='flex flex-col gap-5 font-light text-typo-base mt-7.75'>
        <WithoutLineInput
          id='email'
          label='이메일'
          placeholder='이메일을 입력해주세요'
          value={state.email}
          onChange={(e) => handleChange(e)}
        />
        <WithoutLineInput
          id='password'
          type='password'
          label='비밀번호'
          placeholder='비밀번호를 입력해주세요'
          value={state.password}
          onChange={(e) => handleChange(e)}
        />
        <WithoutLineInput
          id='username'
          label='닉네임'
          placeholder='여행자#1522'
          value={state.username}
          onChange={(e) => handleChange(e)}
        />
        {state.error && <p className='text-left w-full mt-1 text-typo-description text-red-500'>{state.error}</p>}
      </div>

      <div className='flex gap-4 mt-18.25'>
        <CancelButton text='취소' />
        <ConfirmButton
          text={state.loading ? '가입 중...' : '회원가입'}
          onClick={handleSubmit}
          disabled={state.loading}
        />
      </div>
    </NotePage>
  );
}
