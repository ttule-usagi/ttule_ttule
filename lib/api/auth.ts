import { signIn } from 'next-auth/react';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/utils/supabase';
import { auth } from '@/lib/utils/auth';
import { revalidatePath } from 'next/cache';

// 이메일 회원가입
// auth.js에서 회원가입을 지원하지 않는 관계로 next_auth.users에 직접 유저 insert요청

export const signUpWithEmail = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  // 가입 성공 후 자동 로그인
  await signIn('credentials', {
    email,
    password,
    redirectTo: '/lobby',
  });
};

// 이메일 로그인
export const loginWithEmail = async ({ email, password }: { email: string; password: string }) => {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    // authorize()에서 throw한 에러 타입에 따라 메시지 분기
    if (result.error === 'GOOGLE_ACCOUNT') {
      throw new Error('Google 계정으로 가입된 이메일입니다.');
    }
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  return result;
};

// Google 로그인
export const signInWithGoogle = async () => {
  await signIn('google');
};

// 유저 닉네임 업데이트
export const setGoogleNickname = async (nickname: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('인증 정보가 없습니다.');
  }

  if (!nickname || nickname.trim().length === 0) {
    throw new Error('닉네임을 입력해주세요.');
  }

  // DB 업데이트
  const { error } = await supabaseAdmin.from('profiles').update({ username: nickname }).eq('id', session.user.id);

  if (error) {
    console.error('DB Update Error:', error);
    throw new Error('닉네임 저장 중 오류가 발생했습니다.');
  }

  // 신규 유저 쿠키 삭제
  const cookieStore = await cookies();
  cookieStore.delete('is_new_google_user');

  revalidatePath('/');

  return { success: true, message: '닉네임 설정 완료!' };
};
