'use server';

import { auth } from '@/lib/utils/auth';
import { supabaseUser } from '@/lib/utils/supabase';
import { AddEditMemberParams, TokenVerifyParams, TokenVerifyResult } from '@/types/invite';

// edit 토큰 유효성 검증
export const getOrRefreshInviteToken = async ({ id, type }: TokenVerifyParams) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.');
  }

  const supabase = await supabaseUser();
  const { data, error } = await supabase.rpc('get_or_refresh_edit_token', {
    p_resource_id: id,
    p_resource_type: type,
  });

  if (error) throw error;
  if (!data) throw new Error('토큰이 유효하지 않습니다.');
  return data; // token
};

// 토큰이 유효한지 확인만 하는 검증용 함수
// 비로그인 유저도 호출 가능해야 함
export const verifyInviteToken = async ({ token, id, type }: AddEditMemberParams): Promise<TokenVerifyResult> => {
  const supabase = await supabaseUser();
  const { data, error } = await supabase.rpc('verify_invite_token', {
    p_token: token,
    p_resource_id: id,
    p_resource_type: type,
  });

  // 에러를 반환하지 않는 토큰 검증용 함수이므로, rpc 호출 실패 시 INVALID 반환
  if (error) {
    console.error(error);
    return 'INVALID';
  }

  return data;
};

// edit 유저 추가
export const addEditMember = async ({ token, id, type }: AddEditMemberParams) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.');
  }

  const supabase = await supabaseUser();
  const { data, error } = await supabase.rpc('add_edit_member', {
    p_token: token,
    p_resource_id: id,
    p_resource_type: type,
  });

  if (error) {
    console.error(error);
    if (error.code === 'AUTH1') return { error: 'UNAUTHORIZED' };
    if (error.code === 'INV01') return { error: 'INVALID' };
    if (error.code === 'INV02') return { error: 'EXPIRED' };
    return { error: '참여 요청 처리 중 오류가 발생했습니다.' };
  }

  return { data }; // resource_id
};
