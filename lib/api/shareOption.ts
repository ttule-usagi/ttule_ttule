import { Member, ResourceParams } from '@/types/shareOption';
import { RpcError } from '@/types/errors';
import { supabaseUser } from '../utils/supabase';

// 참여 유저 목록 호출
export const getMembers = async ({ id, resourceType }: ResourceParams): Promise<Member[]> => {
  const supabase = await supabaseUser();
  const { data, error } = await supabase.rpc('get_members', {
    p_resource_id: id,
    p_resource_type: resourceType,
  });

  if (error) {
    console.error('❌ 참여 유저 목록 호출 실패:', error);
    throw new RpcError('참여 유저 목록을 불러오는 중 오류가 발생했습니다.', error.code);
  }

  return data ?? [];
};
