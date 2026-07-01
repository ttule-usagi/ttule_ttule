import type { SupabaseClient } from '@supabase/supabase-js';
import type { CorePlaceDetail } from '@/types/CorePlace'; 

export const getCorePlaceDetail = async ({
  supabase,
  placeId,
}: {
  supabase: SupabaseClient;
  placeId: string;
}): Promise<CorePlaceDetail> => {
  const { data, error } = await supabase.rpc('get_core_place_detail', {
    p_core_place_id: placeId,
  });

  if (error) throw error;
  if (!data) throw new Error('장소 정보를 가져오는 데 실패했습니다.');
  return data as CorePlaceDetail;
};