'use server';

import { ActionResult, isPostgresError, RpcErrorMessage, SQLSTATE_TO_RPC_ERROR } from '@/types/errors';
import { supabaseUser } from '../utils/supabase';
import { DeleteMemberParams, SetPublicParams } from '@/types/shareOption';

// 참여 유저 삭제
export const deleteMember = async ({
  id,
  resourceType,
  targetUserId,
}: DeleteMemberParams): Promise<ActionResult<null>> => {
  try {
    const supabase = await supabaseUser();

    const { error } = await supabase.rpc('delete_member', {
      p_resource_id: id,
      p_resource_type: resourceType,
      p_target_user_id: targetUserId,
    });

    if (error) {
      console.error('❌ 참여 유저 삭제 실패:', error);
      const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
      return { success: false, error: { message, code: error.code } };
    }

    return { success: true, data: null };
  } catch (error: unknown) {
    console.error('❌ 참여 유저 삭제 실패: ', error);
    const code = isPostgresError(error) ? error.code : undefined;
    const message = ((code && SQLSTATE_TO_RPC_ERROR[code]) ?? 'INTERNAL_ERROR') as RpcErrorMessage;
    return { success: false, error: { message, code } };
  }
};

// 공개, 비공개 설정
export const setPublic = async ({ id, resourceType, isPublic }: SetPublicParams): Promise<ActionResult<null>> => {
  try {
    const supabase = await supabaseUser();

    const { error } = await supabase.rpc('set_public', {
      p_is_public: isPublic,
      p_resource_id: id,
      p_resource_type: resourceType,
    });

    if (error) {
      console.error('❌ 공개/비공개 설정 실패: ', error);
      const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
      return { success: false, error: { message, code: error.code } };
    }

    return { success: true, data: null };
  } catch (error: unknown) {
    console.error('❌ 공개/비공개 설정 실패: ', error);
    const code = isPostgresError(error) ? error.code : undefined;
    const message = ((code && SQLSTATE_TO_RPC_ERROR[code]) ?? 'INTERNAL_ERROR') as RpcErrorMessage;
    return { success: false, error: { message, code } };
  }
};
