'use server';

import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { AuthError as NextAuthError } from 'next-auth';

import { auth } from '@/lib/utils/auth';
import { signIn, signOut } from '@/lib/utils/auth';
import { supabaseAdmin } from '@/lib/utils/supabase';
import { getEmailErrorMessage, getPasswordErrorMessage, getUsernameErrorMessage } from '@/lib/utils/validate';
import { ActionResult, SQLSTATE_TO_RPC_ERROR } from '@/types/errors';

// 유저 닉네임 업데이트
export const setGoogleAccount = async (nickname: string, profileImage: string | null): Promise<ActionResult<null>> => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: { message: 'UNAUTHORIZED', code: '42501' },
    };
  }

  const usernameError = getUsernameErrorMessage(nickname);
  if (usernameError) {
    return {
      success: false,
      error: {
        message: 'VALIDATION_ERROR',
        field: 'username',
        detail: usernameError,
      },
    };
  }

  // DB 업데이트
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ username: nickname, profile_image_url: profileImage })
    .eq('id', session.user.id);

  if (error) {
    console.error('❌ 닉네임 수정 실패: ', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  // httpOnly 쿠키는 서버에서만 삭제 가능
  const cookieStore = await cookies();
  cookieStore.delete('is_new_google_user');

  return { success: true, data: null };
};

// 이메일 회원가입을 위한 서버액션
export async function signUpAction(formData: {
  email: string;
  password: string;
  username: string;
  profileImageUrl?: string;
}): Promise<ActionResult<{ userId: string }>> {
  const { email, password, username, profileImageUrl } = formData;

  // 유효성 검사
  const emailError = getEmailErrorMessage(email);
  if (emailError) {
    return {
      success: false,
      error: { message: 'VALIDATION_ERROR', field: 'email', detail: emailError },
    };
  }

  const passwordError = getPasswordErrorMessage(password);
  if (passwordError) {
    return {
      success: false,
      error: {
        message: 'VALIDATION_ERROR',
        field: 'password',
        detail: passwordError,
      },
    };
  }

  const usernameError = getUsernameErrorMessage(username);
  if (usernameError) {
    return {
      success: false,
      error: {
        message: 'VALIDATION_ERROR',
        field: 'username',
        detail: usernameError,
      },
    };
  }

  // 이메일 중복 확인
  const { data: existingProfile } = await supabaseAdmin.from('profiles').select('id').eq('email', email).maybeSingle();

  if (existingProfile) {
    return { success: false, error: { message: 'CONFLICT', detail: '이미 사용중인 이메일입니다.', field: 'email' } };
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // RPC로 트랜잭션 처리
  const { data: userId, error } = await supabaseAdmin.rpc('create_email_user', {
    p_email: email,
    p_username: username,
    p_hashed_password: hashedPassword,
    p_profile_image_url: profileImageUrl || null,
  });

  if (error) {
    console.error('❌ 이메일 회원가입 실패: ', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  // 로그인 처리
  await signIn('credentials', { email, password, redirectTo: '/lobby' });

  return { success: true, data: { userId } };
}

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
export const withdraw = async (): Promise<ActionResult<null>> => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    console.error('❌ 탈퇴 실패: 인증되지 않은 요청');
    return {
      success: false,
      error: { message: 'UNAUTHORIZED', code: '42501' },
    };
  }

  const { error } = await supabaseAdmin.schema('next_auth').from('users').delete().eq('id', userId);

  if (error) {
    console.error('❌ 탈퇴 실패: ', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  const cookieStore = await cookies();
  cookieStore.delete('is_new_google_user');

  await signOut({ redirect: false });

  return { success: true, data: null };
};
