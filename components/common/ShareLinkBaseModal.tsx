'use client';

import { Icon } from './Icon';

/**
 * 공유/초대 링크 모달의 공통 레이아웃 컴포넌트
 *
 * - title, description: 모달 상단 공통 텍스트
 * - children: 모달별 고유 콘텐츠 (링크 입력, 링크 복사 등)
 * - onClose: 모달 닫기 핸들러 (GlobalModal의 close 함수 전달)
 */

interface ShareLinkBaseModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const ShareLinkBaseModal = ({ title, description, children, onClose }: ShareLinkBaseModalProps) => {
  return (
    <div
      className='flex flex-col gap-5 bg-white aspect-560/191 rounded-lg relative pt-7 px-6 pb-6 w-[clamp(380px,35vw,560px)]'
      onClick={(e) => e.stopPropagation()}
    >
      <Icon
        name='XClose'
        size={32}
        className='absolute top-3 right-3 text-brand-gray-500 cursor-pointer'
        onClick={onClose}
      />
      <div className='flex flex-col gap-0.5 items-center'>
        <p className='text-typo-sub-title text-brand-blue-700'>{title}</p>
        <p className='text-typo-description text-brand-gray-600'>{description}</p>
      </div>
      {children}
    </div>
  );
};
