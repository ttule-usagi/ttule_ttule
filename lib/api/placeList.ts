import type { SupabaseClient } from '@supabase/supabase-js';
import { toCamelKey } from '@/lib/utils/toCamelCase';
import type { Place, PageParam, AllPlaceLists, ListType } from '@/types/placeList';

interface GetPlaceListPlacesProps {
  supabase: SupabaseClient;
  listId: string;
  cursor?: PageParam;
}

export const getPlaceListPlaces = async ({
  supabase,
  listId,
  cursor = null,
}: GetPlaceListPlacesProps): Promise<Place[]> => {
  const { data, error } = await supabase.rpc('get_place_list_places', {
    p_list_id: listId,
    p_cursor_created_at: cursor?.createdAt ?? null,
    p_cursor_id: cursor?.id ?? null,
    p_limit: 20,
  });

  if (error) throw error;
  if (!data) throw new Error('저장된 장소를 가져오는 데 실패했습니다.');
  return toCamelKey<Place[]>(data);
};

interface getAllPlaceListProps {
  listType: ListType;
  limit?: number;
  offset: number;
}

// 전체 장소 리스트 조회
export const getAllPlaceLists = async ({
  supabase,
  listType,
  limit = 10,
  offset,
}: getAllPlaceListProps & { supabase: SupabaseClient }): Promise<AllPlaceLists> => {
  const { data, error } = await supabase.rpc('get_all_place_list', {
    p_type: listType,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) throw error;
  if (!data) throw new Error('장소 리스트를 가져오는 데 실패했습니다.');
  return toCamelKey<AllPlaceLists>(data);
};