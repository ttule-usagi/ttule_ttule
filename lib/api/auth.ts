import { signIn } from 'next-auth/react';

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
