'use server';

import { AllPlaceLists, ListType } from '@/types/placeList';
import { auth } from '../utils/auth';
import { supabaseAdmin } from '../utils/supabase';
import { toCamelKey } from '../utils/toCamelCase';

export interface CreatePlaceListForm {
  title: string;
  icon?: string;
  description?: string;
}

interface getAllPlaceListProps {
  listType: ListType;
  limit?: number;
  offset: number;
}

export const createNewPlaceList = async ({ title, icon, description }: CreatePlaceListForm) => {
  // 인증 확인
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('인증 정보가 없습니다.');
  }
  if (!title.trim()) throw new Error('리스트 제목을 입력해주세요.');

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

export const getAllPlaceLists = async ({
  listType,
  limit = 10,
  offset,
}: getAllPlaceListProps): Promise<AllPlaceLists> => {
  // 인증 확인
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('인증 정보가 없습니다.');
  }

  const supabase = await supabaseAdmin;
  const { data, error } = await supabase.rpc('get_all_place_list', {
    p_user_id: session.user.id,
    p_type: listType,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) throw error;
  if (!data) throw new Error('장소 리스트를 가져오는 데 실패했습니다.');
  return toCamelKey<AllPlaceLists>(data);
};
