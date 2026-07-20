'use server';

import { ActionResult } from '@/types/errors';
import { supabaseUser } from '../utils/supabase';
import { DeleteMemberParams, SetPublicParams } from '@/types/shareOption';

// 참여 유저 삭제
export const deleteMember = async ({ id, resourceType, targetUserId }: DeleteMemberParams): Promise<ActionResult> => {
  const supabase = await supabaseUser();

  const { error } = await supabase.rpc('delete_member', {
    p_resource_id: id,
    p_resource_type: resourceType,
    p_target_user_id: targetUserId,
  });

  if (error) {
    console.error('❌ 참여 유저 삭제 실패:', error);
    return { error: '참여 유저를 삭제하는 중 오류가 발생했습니다.', code: error.code };
  }

  return { success: true };
};

// 공개, 비공개 설정
export const setPublic = async ({ id, resourceType, isPublic }: SetPublicParams): Promise<ActionResult> => {
  const supabase = await supabaseUser();

  const { error } = await supabase.rpc('set_public', {
    p_is_public: isPublic,
    p_resource_id: id,
    p_resource_type: resourceType,
  });

  if (error) {
    console.error('❌ 공개/비공개 설정 실패:', error);
    return { error: '공개 여부 설정중 오류가 발생했습니다.', code: error.code };
  }

  return { success: true };
};
