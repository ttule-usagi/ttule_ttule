'use client';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import NotePage from '@/components/common/NotePage';
import ProfileImageUploader from '@/components/features/ProfileImageUploader';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateNickname } from '@/lib/api/auth';

export default function SignUpGoogle() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({ nickname: '' });

  // 세션이 로드되면 DB에서 가져온 닉네임을 기본값으로 설정
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.username) {
      setForm({ nickname: session.user.username });
    }

    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    if (!form.nickname.trim()) {
      alert('닉네임을 입력해 주세요.');
      return;
    }

    try {
      await updateNickname(form.nickname);

      alert('가입 완료!');
      router.push('/lobby');
    } catch (error: any) {
      console.error(error);
      alert(error.message || '오류가 발생했습니다.');
    }
  };

  if (status === 'loading') return <div>로딩 중...</div>;

  return (
    <NotePage title='뚤레뚤레 가입하기'>
      <ProfileImageUploader />

      <div className='flex flex-col gap-5 font-light text-typo-base mt-7.75'>
        <div className='flex gap-3'>
          <span className='text-brand-blue-700'>계정:</span>
          <span className='text-brand-gray-400'>{session?.user?.email || '불러오는 중...'}</span>
        </div>
        <div className='flex gap-3'>
          <label
            className='text-brand-blue-700'
            htmlFor='nickname'
          >
            닉네임:
          </label>
          <input
            name='nickname'
            type='text'
            className='text-typo-base font-light focus:outline-none placeholder:text-brand-gray-300'
            placeholder='닉네임을 입력해 주세요'
            id='nickname'
            value={form.nickname}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className='flex gap-4 mt-18.25'>
        <CancelButton text='취소' />
        <ConfirmButton
          text='확인'
          onClick={handleConfirm}
        />
      </div>
    </NotePage>
  );
}
