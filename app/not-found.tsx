'use client';

import { Icon } from '@/components/common/Icon';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <section className='w-screen h-screen flex flex-col items-center justify-center'>
      <div className='flex flex-col gap-12'>
        <div className='flex flex-col gap-3'>
          <Image
            src='/images/sad-tomato.png'
            alt='sad-tomato'
            width={92}
            height={80}
          />
          <p className='font-medium text-6xl text-[#181D27]'>페이지를 찾을 수 없습니다</p>
          <p className='text-[20px] text-[#535862] mt-3 font-light'>
            지금 입력하신 주소의 페이지는 사라졌거나 다른 페이지로 변경되었습니다.
            <br />
            주소를 다시 확인해주세요.
          </p>
        </div>

        <div className='flex gap-3'>
          <button
            onClick={() => router.back()}
            className='px-4.5 py-3 flex items-center justify-center box-border cursor-pointer rounded-lg border gap-1.5 border-[#D5D7DA] text-typo-base-bold text-[#414651] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] font-medium'
          >
            <Icon
              name='ArrowLeft'
              size={20}
              className='text-[#A4A7AE]'
            />{' '}
            뒤로가기
          </button>

          <Link
            href='/'
            className='flex items-center justify-center rounded-lg border-2 border-white/12 bg-brand-blue-700 px-4.5 py-3, 0_-2px_0_0_rgba(10,13,18,0.05)_inset shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'
          >
            <span className='px-0.5 text-typo-base-bold font-semibold text-white'>홈으로 이동</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
