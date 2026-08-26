'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Icon } from '@/components/common/Icon';
import InfoContainerModal from '@/components/features/info/InfoContainerModal';
import InfoTomato from '@/components/features/info/InfoTomato';
import JoinPlanButton from '@/components/features/JoinPlanButton';
import LoginButton from '@/components/features/LoginButton';

export default function Home() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <>
      <div className='overflow-y-auto overflow-x-hidden'>
        <div className='relative bg-brand-blue-50 w-screen h-screen overflow-hidden'>
          <h1 className='absolute top-4 left-4 text-brand-blue-100 text-typo-base z-10 2xl:text-brand-gray-400'>
            @뚤레뚤레
          </h1>
          <Icon
            name='HelpCircle'
            size={32}
            onClick={() => setIsInfoModalOpen(true)}
            className='absolute top-4 right-4 text-brand-blue-100/50 z-10 hover:text-brand-blue-100 transition-colors cursor-pointer'
          />
          <div className='w-full h-full flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-2.5 items-center justify-center z-10 relative'>
              <p className='text-typo-title text-brand-gray-200 font-normal text-[25px]'>
                함께 떠나기 좋은 여행 플래너
              </p>
              <Image
                src='/images/logo.svg'
                width={280}
                height={94}
                alt='뚤레뚤레 logo'
              />
              <div className='flex flex-col items-center  mt-1'>
                <p className='text-typo-description text-brand-gray-200'>
                  나만의 여행 위시리스트와 계획을 편리하게 공유·관리
                </p>
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
              <InfoTomato onClick={() => setIsInfoModalOpen(true)} />
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
          <div
            className='absolute -top-14 -left-4 xl:left-auto xl:right-0 z-1 
      transition-all delay-150 duration-300 ease-in-out'
          >
            <Image
              src='/images/blue-checker-board.webp'
              width={1550}
              height={922}
              sizes='100vw'
              alt='background blue checker board'
              className='max-w-none h-lg:h-[100vh] h-lg:w-auto h-lg:max-w-[168vh]'
              quality={75}
            />
          </div>
          <Image
            src='/images/clips.svg'
            width={269.68}
            height={351.24}
            alt='clips'
            className='absolute w-60 h-auto top-18 -left-8 z-1 drop-shadow-lg transition-all delay-150 duration-300
         ease-in-out lg:left-4 '
          />
          <Image
            src='/images/pen.svg'
            width={507.15}
            height={769.01}
            alt='pen'
            className='absolute w-100 h-auto rotate-[154.98deg] -top-55 left-1/2 z-1 drop-shadow-lg transition-all 
        delay-100 duration-500 ease-in-out lg:translate-x-1/4 lg:-top-50 lg:scale-[1.05]'
          />
          <Image
            src='/images/pencil.svg'
            width={710.38}
            height={291.75}
            alt='pencil'
            className='absolute w-130 h-auto bottom-20 -left-60 rotate-[-42deg] z-1 drop-shadow-lg transition-all delay-100 
        duration-700 ease-in-out lg:rotate-[-25deg] lg:-left-40 lg:bottom-30'
          />
          <Image
            src='/images/glasses.svg'
            width={735.32}
            height={588.83}
            alt='glasses'
            className='absolute w-160 h-auto -bottom-10 rotate-[-5deg] z-1 drop-shadow-lg transition-all delay-100 
        duration-700 ease-in-out left-1/2 translate-x-35 lg:translate-x-50'
          />
          {isInfoModalOpen && <InfoContainerModal onClose={() => setIsInfoModalOpen(false)} />}
        </div>
        <footer className='left-0 -bottom-2 bg-brand-blue-50 flex gap-2 text-typo-description p-4 z-10'>
          <Link
            href='/service?tab=terms'
            className='text-brand-gray-400 hover:opacity-80 transition-opacity'
          >
            이용약관
          </Link>
          <Link
            href='/service?tab=privacy'
            className='text-brand-gray-400 hover:opacity-80 transition-opacity'
          >
            개인정보처리방침
          </Link>
        </footer>
      </div>
    </>
  );
}
