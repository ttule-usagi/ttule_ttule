'use server';

import { auth } from '@/lib/utils/auth';
import { supabaseUser } from '@/lib/utils/supabase';
import { AddEditMemberParams, TokenVerifyParams } from '@/types/invite';

// edit 토큰 유효성 검증
export const verifyEditToken = async ({ id, type }: TokenVerifyParams) => {
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

  if (error) throw error;
  if (!data) throw new Error('유저 초대에 실패했습니다.');
  return data; // resource_id
};
