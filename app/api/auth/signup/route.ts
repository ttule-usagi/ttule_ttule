import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from '@/lib/utils/supabase';

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password: string) =>
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);

const validateUsername = (username: string) => /^[가-힣a-zA-Z0-9]{2,20}$/.test(username);

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    // 유효성 검사
    if (!validateEmail(email)) {
      return NextResponse.json({ error: '유효하지 않은 이메일 형식입니다.', field: 'email' }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: '비밀번호는 8자 이상, 대문자와 특수문자를 포함해야 합니다.', field: 'password' },
        { status: 400 },
      );
    }

    if (!validateUsername(username)) {
      return NextResponse.json(
        { error: '닉네임은 2-20자의 한글, 영문, 숫자만 사용 가능합니다.', field: 'username' },
        { status: 400 },
      );
    }

    // 이메일 중복 확인
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json({ error: '이미 사용중인 이메일입니다.', field: 'email' }, { status: 409 });
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
      return NextResponse.json({ error: '회원가입 중 오류가 발생했습니다.', field: 'general' }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.', field: 'general' }, { status: 500 });
  }
}
