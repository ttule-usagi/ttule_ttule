'use client';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import NotePage from '@/components/common/NotePage';
import ProfileImageUploader from '@/components/features/ProfileImageUploader';
import { useReducer } from 'react';
import { signUpWithEmail } from '@/lib/actions/auth';

type State = {
  email: string;
  password: string;
  username: string;
  error: string;
  loading: boolean;
};

type Action =
  | { type: 'SET_FIELD'; field: 'email' | 'password' | 'username'; value: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_LOADING'; loading: boolean };

const initialState: State = {
  email: '',
  password: '',
  username: '',
  error: '',
  loading: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    default:
      return state;
  }
};

export default function SignUpEmail() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async () => {
    dispatch({ type: 'SET_ERROR', error: '' });
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      await signUpWithEmail({
        email: state.email,
        password: state.password,
        username: state.username,
      });
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', error: e.message });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  return (
    <NotePage title='뚤레뚤레 가입하기'>
      <ProfileImageUploader />

      <div className='flex flex-col gap-5 font-light text-typo-base mt-7.75'>
        <div className='flex gap-3'>
          <span className='text-brand-blue-700'>이메일:</span>
          <input
            className='text-brand-gray-400'
            placeholder='이메일을 입력해주세요'
            value={state.email}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
          />
        </div>
        <div className='flex gap-3'>
          <span className='text-brand-blue-700'>비밀번호:</span>
          <input
            className='text-brand-gray-400'
            placeholder='비밀번호를 입력해주세요'
            value={state.password}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
          />
        </div>
        <div className='flex gap-3'>
          <label
            className='text-brand-blue-700'
            htmlFor='nickname'
          >
            뚤레 닉네임:
          </label>
          <input
            type='text'
            className='text-typo-base font-light focus:outline-none placeholder:text-brand-gray-300'
            placeholder='랜덤닉네임'
            id='nickname'
            value={state.username}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'username', value: e.target.value })}
          />
        </div>
      </div>
      {state.error && <p>{state.error}</p>}

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
