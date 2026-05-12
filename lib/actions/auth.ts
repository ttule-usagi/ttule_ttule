'use server';

import { supabaseAdmin } from '@/lib/utils/supabase';
import { auth } from '@/lib/utils/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { signIn } from '@/lib/utils/auth';

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

  // httpOnly 쿠키는 서버에서만 삭제 가능
  const cookieStore = await cookies();
  cookieStore.delete('is_new_google_user');

  return { success: true, message: '닉네임 설정 완료!' };
};


const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password: string) =>
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);

const validateUsername = (username: string) => /^[가-힣a-zA-Z0-9]{2,20}$/.test(username);

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
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

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

