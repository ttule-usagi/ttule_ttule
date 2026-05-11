'use client';

import Link from 'next/link';

export default function LoginButton() {
  return (
    <Link href='/login'>
      <button className='text-typo-title font-normal bg-brand-gray-50 text-brand-blue-700 border border-brand-blue-200 rounded-lg h-13 w-66 cursor-pointer'>
        로그인
      </button>
    </Link>
  );
}
