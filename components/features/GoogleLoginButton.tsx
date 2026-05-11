'use client';

import { Icon } from '../common/Icon';

interface GoogleSignInButtonProps {
  onClick?: () => void;
}

export default function GoogleSignInButton({ onClick }: GoogleSignInButtonProps) {
  return (
    <button
      onClick={onClick}
      className='flex w-full max-w-90 py-3 px-4 rounded-sm border border-brand-gray-300 gap-3 items-center justify-center text-typo-base font-medium text-[#344054] shadow-sm cursor-pointer max-h-12'
    >
      <Icon
        name='Google'
        size={24}
      />
      구글 계정으로 계속하기
    </button>
  );
}
