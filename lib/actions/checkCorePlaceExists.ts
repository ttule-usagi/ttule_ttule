'use server';

import { supabaseUser } from '../utils/supabase';

export const checkCorePlaceExists = async (googlePlaceId: string): Promise<string | null> => {
  const supabase = await supabaseUser();
  const { data, error } = await supabase.rpc('check_core_place_exists', {
    p_google_place_id: googlePlaceId,
  });

  if (error) {
    console.error('❌ checkCorePlaceExists 에러:', error);
    return null; // 조회 실패 시 "미등록"으로 간주 — 등록 흐름을 막지 않기 위함
  }

  return data ?? null;
};
