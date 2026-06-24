'use server';

import { AllPlaceLists, ListType, PageParam, Place, PlaceListDetail, Tag } from '@/types/placeList';
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

// 장소 리스트 생성
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

// 전체 장소 리스트 조회
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

// 장소 리스트 상세 개요
export const getPlaceListDetail = async (listId: string): Promise<PlaceListDetail> => {
  // 인증 확인
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('인증 정보가 없습니다.');
  }

  const supabase = await supabaseAdmin;
  const { data, error } = await supabase
    .rpc('get_place_list_detail', {
      p_list_id: listId,
    })
    .single();

  if (error) throw error;
  if (!data) throw new Error('장소 리스트 상세정보를 가져오는 데 실패했습니다.');
  return toCamelKey<PlaceListDetail>(data);
};

// 장소 리스트에 저장된 장소
export const getPlaceListPlaces = async (listId: string, cursor: PageParam = null): Promise<Place[]> => {
  // 인증 확인
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('인증 정보가 없습니다.');
  }

  const supabase = await supabaseAdmin;
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

// 장소 리스트에 저장된(생성된) 태그
export const getPlaceListTags = async (listId: string): Promise<Tag[]> => {
  // 인증 확인
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('인증 정보가 없습니다.');
  }

  const supabase = await supabaseAdmin;
  const { data, error } = await supabase.rpc('get_place_list_tags', {
    p_list_id: listId,
  });

  if (error) throw error;
  if (!data) throw new Error('저장된 태그를 가져오는 데 실패했습니다.');
  return toCamelKey<Tag[]>(data);
};
