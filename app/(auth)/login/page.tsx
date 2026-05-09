'use client';

import { signInWithGoogle } from '@/lib/api/auth';
import GoogleLoginButton from '@/components/features/GoogleLoginButton';
import Image from 'next/image';
import AuthCommonInput from '@/components/common/AuthCommonInput';

export default function Login() {
  return (
    <div className='h-screen w-full flex'>
      <main className='flex flex-col items-center justify-center px-8 w-[30vw] max-w-160 relative'>
        <div className='w-full max-w-90 flex flex-col items-center relative'>
          <div className='absolute top-[-20%] left-0'>
            <Image
              src='/images/logo-small.svg'
              alt='Logo'
              width={79.25}
              height={22.97}
              className='max-w-[79.25px] h-auto pl-0.5'
            />
          </div>
          <header className='text-[2rem] text-[#101828] font-bold text-left w-full'>로그인</header>

          <div className='flex flex-col gap-5 mt-8 w-full items-center'>
            <AuthCommonInput
              label='이메일'
              placeholder='이메일을 입력해주세요'
            />
            <AuthCommonInput
              label='비밀번호'
              placeholder='비밀번호를 입력해주세요'
            />
          </div>

          <div className='flex justify-between text-typo-description text-brand-blue-600 w-full mt-6'>
            <button className='cursor-pointer'>회원가입</button>
            <button className='cursor-pointer'>비밀번호 변경</button>
          </div>

          <button className='mt-6 w-full bg-brand-blue-700 text-white py-2.5 rounded-sm cursor-pointer'>로그인</button>

          <div className='w-full flex gap-3 items-center mt-6 mb-4'>
            <div className='bg-brand-gray-200 h-px flex-1'></div>
            <span className='text-[#475467] text-typo-description'>간편 로그인하기</span>
            <div className='bg-brand-gray-200 h-px flex-1'></div>
          </div>

          <GoogleLoginButton
            onClick={() => {
              signInWithGoogle();
            }}
          />
        </div>

        <footer className='absolute bottom-0 w-full p-8 text-left text-typo-description text-[#475467]'>
          © 뚤레뚤레
        </footer>
      </main>

      <div className='flex-1 bg-[#F2F4F7] flex items-center justify-center overflow-hidden'>
        <Image
          src='/images/service-example.svg'
          alt='Service Example'
          width={1024}
          height={682}
          className='h-[40vw] w-auto ml-24'
        />
      </div>
    </div>
  );
}
