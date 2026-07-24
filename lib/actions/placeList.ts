'use server';

import { auth } from '../utils/auth';
import { supabaseAdmin, supabaseUser } from '../utils/supabase';
import { ActionResult, isPostgresError, RpcErrorMessage, SQLSTATE_TO_RPC_ERROR } from '@/types/errors';

export interface CreatePlaceListForm {
  title: string;
  icon?: string;
  description?: string;
}

// 장소 리스트 생성
export const createNewPlaceList = async ({ title, icon, description }: CreatePlaceListForm) => {
  // 인증 확인
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('인증 정보가 없습니다.');
  }
  if (!title.trim()) throw new Error('리스트 제목을 입력해주세요.');
  if (title.length > 20) throw new Error('리스트 제목은 20자 이내여야 합니다.');

  const supabase = await supabaseAdmin;

  const { data, error } = await supabase.rpc('create_place_list', {
    p_title: title.trim(),
    p_icon: icon,
    p_description: description,
    p_user_id: session.user.id,
    p_is_public: false,
  });

  if (error) throw error;
  if (!data) throw new Error('장소 리스트 생성에 실패했습니다.');
  return data;
};

// 리스트 삭제
export const deletePlaceList = async (listId: string): Promise<ActionResult<null>> => {
  try {
    const supabase = await supabaseUser();
    const { error } = await supabase.rpc('delete_place_list', {
      p_list_id: listId,
    });

    if (error) {
      console.error('❌ 리스트 삭제 실패: ', error);
      const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
      return { success: false, error: { message, code: error.code } };
    }

    return { success: true, data: null };
  } catch (error: unknown) {
    console.error('❌ 리스트 삭제 실패: ', error);
    const code = isPostgresError(error) ? error.code : undefined;
    const message = ((code && SQLSTATE_TO_RPC_ERROR[code]) ?? 'INTERNAL_ERROR') as RpcErrorMessage;
    return { success: false, error: { message, code } };
  }
};

// 장소 리스트에 저장된 단일 장소 삭제
export const deletePlace = async ({
  listId,
  placeId,
}: {
  listId: string;
  placeId: string;
}): Promise<ActionResult<null>> => {
  try {
    const supabase = await supabaseUser();
    const { error } = await supabase.rpc('delete_place', {
      p_place_list_id: listId,
      p_place_id: placeId,
    });

    if (error) {
      console.error('❌ 단일 장소 삭제 실패: ', error);
      const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
      return { success: false, error: { message, code: error.code } };
    }

    return { success: true, data: null };
  } catch (error: unknown) {
    console.error('❌ 단일 장소 삭제 실패: ', error);
    const code = isPostgresError(error) ? error.code : undefined;
    const message = ((code && SQLSTATE_TO_RPC_ERROR[code]) ?? 'INTERNAL_ERROR') as RpcErrorMessage;
    return { success: false, error: { message, code } };
  }
};
