'use server';

import { AllPlaceLists, ListType } from '@/types/placeList';
import { auth } from '../utils/auth';
import { supabaseAdmin } from '../utils/supabase';
import { toCamelKey } from '../utils/toCamelCase';

interface getAllPlaceListProps {
  listType: ListType;
  limit?: number;
  offset: number;
}

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
