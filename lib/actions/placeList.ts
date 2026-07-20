'use server';

import { PlaceListDetail, Tag } from '@/types/placeList';
import { auth } from '../utils/auth';
import { supabaseAdmin, supabaseUser } from '../utils/supabase';
import { toCamelKey } from '../utils/toCamelCase';
import { ActionResult } from '@/types/errors';

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

// 장소 리스트 상세 개요
export const getPlaceListDetail = async (
  listId: string,
): Promise<PlaceListDetail | { error: string; code?: string }> => {
  const supabase = await supabaseUser();
  const { data, error } = await supabase.rpc('get_place_list_detail', {
    p_list_id: listId,
  });

  if (error) {
    console.error('리스트 상세정보 조회 실패: ', error);
    if (error.code === '42501') return { error: 'FORBIDDEN', code: '42501' };
    return { error: '리스트 정보 조회 중 오류가 발생했습니다.' };
  }

  if (!data) throw new Error('장소 리스트 상세정보를 가져오는 데 실패했습니다.');
  return data;
};

// 장소 리스트에 저장된(생성된) 태그
export const getPlaceListTags = async (listId: string): Promise<Tag[]> => {
  const supabase = await supabaseUser();
  const { data, error } = await supabase.rpc('get_place_list_tags', {
    p_list_id: listId,
  });

  if (error) throw error;
  if (!data) throw new Error('저장된 태그를 가져오는 데 실패했습니다.');
  return toCamelKey<Tag[]>(data);
};

// 리스트 삭제
export const deletePlaceList = async (listId: string): Promise<ActionResult> => {
  const supabase = await supabaseUser();
  const { error } = await supabase.rpc('delete_place_list', {
    p_list_id: listId,
  });

  if (error) {
    console.error('❌ 리스트 삭제 실패: ', error);
    return { error: '장소 리스트 삭제 중 오류가 발생했습니다.', code: error.code };
  }

  return { success: true };
};
