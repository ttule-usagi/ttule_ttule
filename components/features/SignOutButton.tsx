'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className='px-4 py-2 text-md bg-brand-blue-100 text-brand-gray-500 hover:bg-neon-green rounded-md transition-colors'
    >
      로그아웃
    </button>
  );
}
