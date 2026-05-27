'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/utils/supabase/index';
import { auth } from '@/lib/utils/auth';
import type { CreatePlacePayload } from '@/types/CorePlace';

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
