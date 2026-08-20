'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import InfoContainerModal from '@/components/features/info/InfoContainerModal';
import InfoTomato from '@/components/features/info/InfoTomato';
import JoinPlanButton from '@/components/features/JoinPlanButton';
import LoginButton from '@/components/features/LoginButton';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function Home() {
  const isMounted = useIsMounted();
  const [isModalClosedByUser, setIsModalClosedByUser] = useState(false);
  const isInfoModalOpen = isMounted && !isModalClosedByUser;

  return (
    <div className='bg-brand-blue-50 w-screen h-screen relative overflow-hidden'>
      <h1 className='absolute top-4 right-4 text-white text-typo-base z-999'>@뚤레뚤레</h1>
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <div className='flex flex-col gap-2.5 items-center justify-center z-10 relative'>
          <p className='text-typo-title text-brand-gray-200 font-normal text-[25px]'>함께 떠나기 좋은 여행 플래너</p>
          <Image
            src='/images/logo.svg'
            width={280}
            height={94}
            alt='뚤레뚤레 logo'
          />
          <div className='flex flex-col items-center  mt-2'>
            <p className='text-typo-description text-brand-gray-200'>나만의 여행 위시리스트와 계획을 만들고,</p>
            <p className='text-typo-description text-brand-gray-200'>친구와 함께 편집할 수 있어요.</p>
          </div>
          <Image
            src='/images/clip.svg'
            width={97.54}
            height={29.31}
            alt='clip'
            className='absolute bottom-[-36%] right-[-31.5%]'
          />
        </div>
        <div className='flex flex-col gap-2.5 z-10 mt-43'>
          <InfoTomato onClick={() => setIsModalClosedByUser(false)} />
          <JoinPlanButton variant='primary' />
          <LoginButton />
        </div>
        <p className='text-white text-typo-description mt-3 z-10 font-light'>
          처음 방문하셨나요?{' '}
          <Link
            href='/signup'
            className='text-neon-green underline'
          >
            회원가입
          </Link>
        </p>
      </div>

      {/* 배경 아이템 */}
      <div className='fixed top-0 right-0 z-1'>
        <Image
          src='/images/blue-checker-board.png'
          width={1550}
          height={922}
          alt='background blue checker board'
          className='max-w-none'
        />
      </div>
      <Image
        src='/images/clips.svg'
        width={269.68}
        height={351.24}
        alt='clips'
        className='absolute w-[14vw] h-auto top-[5%] left-[2%] z-1'
      />
      <Image
        src='/images/pen.svg'
        width={507.15}
        height={769.01}
        alt='pen'
        className='absolute w-[26vw] h-auto rotate-[154.98deg] top-[-26%] left-[54%] z-1'
      />
      <Image
        src='/images/pencil.svg'
        width={710.38}
        height={291.75}
        alt='pencil'
        className='absolute w-[40vw] h-auto bottom-[5%] left-[-17%] rotate-[-25.02deg] z-1'
      />
      <Image
        src='/images/glasses.svg'
        width={735.32}
        height={588.83}
        alt='glasses'
        className='absolute w-[38vw] h-auto right-[2%] bottom-0 z-1'
      />

      {isInfoModalOpen && <InfoContainerModal onClose={() => setIsModalClosedByUser(true)} />}
    </div>
  );
}
