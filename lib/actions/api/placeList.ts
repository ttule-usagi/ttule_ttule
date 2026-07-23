import type { SupabaseClient } from '@supabase/supabase-js';
import { toCamelKey } from '@/lib/utils/toCamelCase';
import type { Place, PageParam, AllPlaceLists, ListType, PlaceListDetail, Tag } from '@/types/placeList';
import { RpcError } from '@/types/errors';

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

// 장소 리스트 상세 개요(헤더 정보)
export const getPlaceListDetail = async ({
  supabase,
  listId,
}: {
  supabase: SupabaseClient;
  listId: string;
}): Promise<PlaceListDetail> => {
  const { data, error } = await supabase.rpc('get_place_list_detail', {
    p_list_id: listId,
  });

  if (error) {
    console.error('❌ 리스트 상세정보 조회 실패: ', error);
    throw new RpcError(error.message, error.code);
  }

  if (!data) throw new RpcError('장소 리스트 상세정보를 가져오는 데 실패했습니다.');
  return data;
};

// 장소 리스트에 저장된(생성된) 태그
export const getPlaceListTags = async ({
  supabase,
  listId,
}: {
  supabase: SupabaseClient;
  listId: string;
}): Promise<Tag[]> => {
  const { data, error } = await supabase.rpc('get_place_list_tags', {
    p_list_id: listId,
  });

  if (error) {
    console.error('❌ 태그 조회 실패', error);
    throw new RpcError(error.message, error.code);
  }
  if (!data) throw new RpcError('저장된 태그를 가져오는 데 실패했습니다.');
  return toCamelKey<Tag[]>(data);
};
