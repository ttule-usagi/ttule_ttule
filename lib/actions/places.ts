'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin, supabaseUser } from '@/lib/utils/supabase/index';
import { auth } from '@/lib/utils/auth';
import type { CreatePlacePayload } from '@/types/CorePlace';
import { CorePlaceDetail } from '@/types/CorePlace';

// 이미 등록한 장소인지 체크
export async function checkPlaceExists(googlePlaceId: string) {
  const { data } = await supabaseAdmin
    .from('core_place')
    .select('id')
    .eq('google_place_id', googlePlaceId)
    .maybeSingle();

  return data?.id ?? null;
}

// 새로운 Core Place 장소 생성
interface CreatePlaceSuccess {
  success: true;
  placeId: string;
}

interface CreatePlaceError {
  success: false;
  error: string;
}

type CreatePlaceResult = CreatePlaceSuccess | CreatePlaceError;

export async function createNewPlace(payload: CreatePlacePayload): Promise<CreatePlaceResult> {
  // 1. 인증
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  // 2. RPC 호출 (트랜잭션)
  const { data: placeId, error } = await supabaseAdmin.rpc('create_place_with_images', {
    p_google_place_id: payload.google_place_id,
    p_latitude: payload.latitude,
    p_longitude: payload.longitude,
    p_korean_name: payload.korean_name,
    p_english_name: payload.english_name,
    p_original_name: payload.original_name,
    p_address: payload.address,
    p_category: payload.category,
    p_business_status: payload.business_status,
    p_website_uri: payload.website_uri,
    p_phone_number: payload.phone_number,
    p_image_url: payload.image_url,
    p_uploaded_by: session.user.id,
  });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: '이미 등록된 장소입니다.' };
    }
    console.error('createNewPlace RPC error:', error);
    return { success: false, error: '장소 등록 중 오류가 발생했습니다.' };
  }
  // 4. 캐시 무효화
  revalidatePath('/places');

  return { success: true, placeId };
}

interface AddPlaceToListProps {
  placeListId: string;
  placeDetail: CorePlaceDetail;
}

export const addPlaceToList = async ({ placeListId, placeDetail }: AddPlaceToListProps) => {
  if (!placeListId) return { error: 'INVALID_LIST_ID' };
  if (!placeDetail.place.id) return { error: 'INVALID_PLACE_ID' };

  const { place, images } = placeDetail;
  const mainImage = images.find((img) => img.isMain) ?? images[0];
  const customName = place.koreanName ?? place.originalName ?? place.englishName;

  const supabase = await supabaseUser();

  const { error } = await supabase.from('place').insert({
    place_list_id: placeListId,
    core_place_id: place.id,
    latitude: place.latitude,
    longitude: place.longitude,
    custom_name: customName,
    category: place.category,
    thumbnail: mainImage?.imgUrl ?? null,
  });

  if (error) {
    if (error.code === '23505') return { error: 'ALREADY_SAVED' };
    return { error: error.message };
  }

  return { data: true };
};
