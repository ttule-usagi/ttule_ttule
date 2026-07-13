'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ForbiddenRedirect() {
  const router = useRouter();
  useEffect(() => {
    alert('페이지가 존재하지 않습니다.');
    router.push('/lobby'); // 확인버튼 누르면 리다이렉트
  }, [router]);
  return null;
}
