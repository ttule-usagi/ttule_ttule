'use server';

import { supabaseUser } from '@/lib/utils/supabase';
import type { CorePlaceDetail } from '@/types/CorePlace';

interface AddPlanItemProps {
  scheduleId: string;
  placeDetail: CorePlaceDetail;
}

export const addPlanItem = async ({ scheduleId, placeDetail }: AddPlanItemProps) => {
  const { place, images } = placeDetail;
  const mainImage = images.find((img) => img.isMain) ?? images[0];
  const placeName = place.koreanName ?? place.originalName ?? place.englishName;

  const supabase = await supabaseUser();

  try {
    const { data, error } = await supabase.rpc('add_plan_item', {
      p_schedule_id: scheduleId,
      p_place_id: place.id,
      p_latitude: place.latitude,
      p_longitude: place.longitude,
      p_place_name: placeName,
      p_place_category: place.category,
      p_place_thumbnail: mainImage?.imgUrl ?? null,
      p_google_place_id: place.googlePlaceId,
    });

    if (error) {
      console.error('❌ add_plan_item 에러:', error);
      throw error;
    }
    return { data };
  } catch (error: any) {
    if (error.code === '42501') return { error: 'UNAUTHORIZED' };
    return { error: error.message };
  }
};

interface AddPlanMemoItemProps {
  scheduleId: string;
  placeName: string; // ← 필수
  memoContent?: string | null;
  visitTime?: string | null;
}

export const addPlanMemoItem = async ({ scheduleId, placeName, memoContent, visitTime }: AddPlanMemoItemProps) => {
  const supabase = await supabaseUser();

  try {
    const { data, error } = await supabase.rpc('add_plan_memo_item', {
      p_schedule_id: scheduleId,
      p_place_name: placeName,
      p_memo_content: memoContent ?? null,
      p_visit_time: visitTime ?? null,
    });

    if (error) throw error;
    return { data };
  } catch (error: any) {
    console.error('❌ add_plan_memo_item 에러:', error);
    if (error.code === '42501') return { error: 'UNAUTHORIZED' };
    return { error: error.message };
  }
};
