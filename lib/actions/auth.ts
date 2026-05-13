'use server';

import { supabaseAdmin } from '@/lib/utils/supabase';
import { auth } from '@/lib/utils/auth';
import { cookies } from 'next/headers';
import { validateUsername } from '@/lib/utils/validate';

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
