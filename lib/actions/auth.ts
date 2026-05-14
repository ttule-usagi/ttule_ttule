'use server';

import { supabaseAdmin } from '@/lib/utils/supabase';
import { auth } from '@/lib/utils/auth';
import { AuthError as NextAuthError } from 'next-auth';
import { cookies } from 'next/headers';
import { validateEmail, validatePassword, validateUsername } from '@/lib/utils/validate';
import { signIn, signOut } from '@/lib/utils/auth';
import { AuthError } from '@/types/errors';
import bcrypt from 'bcrypt';

// 유저 닉네임 업데이트
export const setGoogleAccount = async (nickname: string, profileImage: string | null) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('인증 정보가 없습니다.');
  }

  if (!nickname || nickname.trim().length === 0) {
    throw new Error('닉네임을 입력해주세요.');
  }

  if (!validateUsername(nickname)) {
    throw new Error('닉네임은 2-20자의 한글, 영문, 숫자만 사용 가능합니다.');
  }

  // DB 업데이트
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ username: nickname, profile_image_url: profileImage })
    .eq('id', session.user.id);

  if (error) {
    console.error('DB Update Error:', error);
    throw new Error('닉네임 저장 중 오류가 발생했습니다.');
  }

  // httpOnly 쿠키는 서버에서만 삭제 가능
  const cookieStore = await cookies();
  cookieStore.delete('is_new_google_user');

  return { success: true, message: '닉네임 설정 완료!' };
};

// 이메일 회원가입을 위한 서버액션
export async function signUpAction(formData: { email: string; password: string; username: string }) {
  const { email, password, username } = formData;

  // 유효성 검사
  if (!validateEmail(email)) {
    return { error: '유효하지 않은 이메일 형식입니다.' };
  }

  if (!validatePassword(password)) {
    return { error: '비밀번호는 8자 이상, 대문자와 특수문자를 포함해야 합니다.' };
  }

  if (!validateUsername(username)) {
    return { error: '닉네임은 2-20자의 한글, 영문, 숫자만 사용 가능합니다.' };
  }

  // 이메일 중복 확인
  const { data: existingProfile } = await supabaseAdmin.from('profiles').select('id').eq('email', email).maybeSingle();

  if (existingProfile) {
    return { error: '이미 사용중인 이메일입니다.' };
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // RPC로 트랜잭션 처리
  const { data: userId, error } = await supabaseAdmin.rpc('create_email_user', {
    p_email: email,
    p_username: username,
    p_hashed_password: hashedPassword,
  });

  if (error) {
    return { error: '회원가입 중 오류가 발생했습니다.' };
  }

  return { success: true, userId };
}

// 이메일 회원가입
// auth.js에서 회원가입을 지원하지 않는 관계로 next_auth.users에 직접 유저 insert요청
export const signUpWithEmail = async ({
  email,
  password,
  username,
  profile_image_url,
}: {
  email: string;
  password: string;
  username: string;
  profile_image_url?: string;
}) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username, profile_image_url }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new AuthError(data.error, data.field);
  }

  // 가입 성공 후 자동 로그인
  await signIn('credentials', {
    email,
    password,
    redirectTo: '/lobby',
  });
};

// 이메일 로그인
export const loginWithEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ error: string } | void> => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof NextAuthError) {
      // authorize()에서 throw한 에러 타입에 따라 메시지 분기
      const message = error.cause?.err?.message;

      if (message === 'GOOGLE_ACCOUNT') {
        return { error: 'Google 계정으로 가입된 이메일입니다.' };
      }
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    throw error;
  }
};

// 탈퇴 기능
export const withdraw = async () => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) return { error: '인증 정보가 없습니다.' };

  const { error } = await supabaseAdmin.schema('next_auth').from('users').delete().eq('id', userId);

  console.log('삭제 결과:', error); // 에러 확인

  if (error) return { error: '회원탈퇴 중 오류가 발생했습니다.' };

  const cookieStore = await cookies();
  cookieStore.delete('is_new_google_user');

  await signOut({ redirectTo: '/' });

  return { success: true };
};
