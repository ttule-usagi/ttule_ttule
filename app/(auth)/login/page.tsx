'use client';

import { loginWithEmail, signInWithGoogle } from '@/lib/api/auth';
import GoogleLoginButton from '@/components/features/GoogleLoginButton';
import Image from 'next/image';
import Link from 'next/link';
import FormInput from '@/components/common/FormInput';
import { AuthState, useAuthForm } from '@/hooks/useAuthForm';
import { useRouter } from 'next/navigation';

const initialState: AuthState = {
  email: '',
  password: '',
  error: '',
  loading: false,
};

export default function Login() {
  const router = useRouter();
  const { state, dispatch, handleChange } = useAuthForm(initialState);

  const handleSubmit = async () => {
    dispatch({ type: 'SET_ERROR', error: '' });
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      await loginWithEmail({
        email: state.email,
        password: state.password,
      });
      router.push('/lobby');
    } catch (e: unknown) {
      if (e instanceof Error) {
        dispatch({ type: 'SET_ERROR', error: e.message });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  return (
    <div className='h-screen w-full flex'>
      <main className='flex flex-col items-center justify-center px-8 w-[30vw] max-w-160 min-w-100 relative'>
        <div className='w-full max-w-90 flex flex-col items-center relative'>
          <Link
            href='/'
            className='absolute top-[-20%] left-0'
          >
            <Image
              src='/images/logo-small.svg'
              alt='Logo'
              width={79.25}
              height={22.97}
              className='max-w-[79.25px] h-auto pl-0.5'
            />
          </Link>
          <header className='text-[2rem] text-login-title font-bold text-left w-full'>로그인</header>

          <form
            className='flex flex-col mt-8 w-full items-center'
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className='flex flex-col gap-5 w-full'>
              <FormInput
                id='email'
                value={state.email}
                onChange={(e) => handleChange(e)}
                label='이메일'
                placeholder='이메일을 입력해주세요'
              />
              <FormInput
                id='password'
                type='password'
                value={state.password}
                onChange={(e) => handleChange(e)}
                label='비밀번호'
                placeholder='비밀번호를 입력해주세요'
              />
            </div>
            {state.error && <p className='text-left w-full mt-2 text-typo-description text-red-500'>{state.error}</p>}

            <div className='flex justify-between text-typo-description text-brand-blue-600 w-full mt-6 font-light'>
              <Link
                href='/signup'
                className='cursor-pointer'
              >
                회원가입
              </Link>
              <Link
                href='/reset-password'
                className='cursor-pointer'
              >
                비밀번호 변경
              </Link>
            </div>

            <button
              type='submit'
              disabled={state.loading}
              className='mt-6 w-full bg-brand-blue-700 text-white py-2.5 rounded-sm cursor-pointer'
            >
              로그인
            </button>
          </form>

          <div className='w-full flex gap-3 items-center mt-12 mb-4 text-typo-description font-light'>
            <div className='bg-brand-gray-200 h-px flex-1'></div>
            <span className='text-login-caption'>간편 로그인하기</span>
            <div className='bg-brand-gray-200 h-px flex-1'></div>
          </div>

          <GoogleLoginButton
            onClick={() => {
              signInWithGoogle();
            }}
          />
        </div>

        <footer className='absolute bottom-0 w-full p-8 text-left text-typo-description text-login-caption'>
          © 뚤레뚤레
        </footer>
      </main>

      <div className='flex-1 bg-login-description flex items-center justify-center overflow-hidden'>
        <Image
          src='/images/service-example.svg'
          alt='Service Example'
          width={1024}
          height={682}
          className='h-[40vw] w-auto'
        />
      </div>
    </div>
  );
}
