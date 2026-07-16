'use server';

import { supabaseUser } from '@/lib/utils/supabase';
import type { CorePlaceDetail } from '@/types/CorePlace';
import { PlanItem, PlanTransitMode } from '@/types/plan';
import { getRouteDistance } from '../utils/googleRoutes';

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

    // 메모는 위치가 없으니 이전 아이템 transit 초기화
    const result = (data as { new_item_id: string; prev_item_id: string | null }[])[0];
    if (result?.prev_item_id) {
      await supabase.rpc('clear_plan_item_transit', {
        p_item_id: result.prev_item_id,
      });
    }

    return { data: result.new_item_id };
  } catch (error: any) {
    console.error('❌ add_plan_memo_item 에러:', error);
    if (error.code === '42501') return { error: 'UNAUTHORIZED' };
    return { error: error.message };
  }
};

export const duplicatePlanItem = async (item: PlanItem) => {
  const supabase = await supabaseUser();

  try {
    const { data, error } = await supabase.rpc('add_plan_item', {
      p_schedule_id: item.scheduleId,
      p_place_id: item.placeId,
      p_latitude: item.latitude,
      p_longitude: item.longitude,
      p_place_name: item.placeName,
      p_place_category: item.placeCategory,
      p_place_thumbnail: item.placeThumbnail,
      p_google_place_id: item.googlePlaceId,
    });

    if (error) throw error;

    const result = (
      data as {
        new_item_id: string;
        prev_item_id: string | null;
        prev_latitude: number | null;
        prev_longitude: number | null;
      }[]
    )[0];

    // transit 계산 추가
    if (result.prev_item_id && result.prev_latitude && result.prev_longitude && item.latitude && item.longitude) {
      const route = await getRouteDistance(
        { lat: result.prev_latitude, lng: result.prev_longitude },
        { lat: item.latitude, lng: item.longitude },
        'driving',
      );

      if (route) {
        await supabase.rpc('update_plan_item_transit', {
          p_item_id: result.prev_item_id,
          p_transit_time: route.durationMinutes,
          p_transit_distance: route.distanceMeters / 1000,
          p_transit_mode: 'driving',
        });
      }
    }

    return { data: result.new_item_id };
  } catch (error: any) {
    if (error.code === '42501') return { error: 'UNAUTHORIZED' };
    return { error: error.message };
  }
};

// 일정 추가 + transit 계산
export const addPlanItemWithTransit = async ({
  scheduleId,
  placeDetail,
  transitMode = 'transit',
}: {
  scheduleId: string;
  placeDetail: CorePlaceDetail;
  transitMode?: PlanTransitMode;
}) => {
  const { place, images } = placeDetail;
  const mainImage = images.find((img) => img.isMain) ?? images[0];
  const placeName = place.koreanName ?? place.originalName ?? place.englishName;

  const supabase = await supabaseUser();

  // 1. 아이템 추가 + 이전 아이템 정보 반환
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

  if (error) return { error: error.message };

  const result = (
    data as {
      new_item_id: string;
      prev_item_id: string | null;
      prev_latitude: number | null;
      prev_longitude: number | null;
      prev_google_place_id: string | null;
    }[]
  )[0];

  // 2. 이전 아이템이 있으면 transit 계산
  if (result.prev_item_id && result.prev_latitude && result.prev_longitude) {
    const route = await getRouteDistance(
      { lat: result.prev_latitude, lng: result.prev_longitude, googlePlaceId: result.prev_google_place_id },
      { lat: place.latitude, lng: place.longitude, googlePlaceId: place.googlePlaceId },
      transitMode,
    );

    if (route) {
      await supabase.rpc('update_plan_item_transit', {
        p_item_id: result.prev_item_id,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: transitMode,
      });
      console.log('update_plan_item_transit', 'ok');
    }
  }

  return { data: result.new_item_id };
};

// 일정 삭제 + transit 초기화
export const deletePlanItem = async (itemId: string) => {
  const supabase = await supabaseUser();

  try {
    // 1. 삭제 + 이전 item id 반환
    const { data: prevItemId, error } = await supabase.rpc('delete_plan_item', {
      p_item_id: itemId,
    });

    if (error) throw error;

    // 2. 이전 item이 있으면 transit 초기화
    if (prevItemId) {
      await supabase.rpc('clear_plan_item_transit', {
        p_item_id: prevItemId,
      });
    }

    return { data: true };
  } catch (error: any) {
    console.error('❌ deletePlanItem 에러:', error);
    if (error.code === '42501') return { error: 'UNAUTHORIZED' };
    return { error: error.message };
  }
};

// 순서 변경 + transit 재계산
export const reorderPlanItem = async ({
  itemId,
  newOrder,
  scheduleId,
  transitMode = 'driving',
}: {
  itemId: string;
  newOrder: number;
  scheduleId: string;
  transitMode?: PlanTransitMode;
}) => {
  const supabase = await supabaseUser();

  try {
    // 1. order 업데이트
    const { error } = await supabase.from('plan_item').update({ order: newOrder }).eq('id', itemId);

    if (error) throw error;

    // 2. 변경된 위치의 현재 item 조회
    const { data: currentItem } = await supabase
      .from('plan_item')
      .select('id, latitude, longitude')
      .eq('id', itemId)
      .single();

    // 3. 이전 item 조회
    const { data: prevItem } = await supabase
      .from('plan_item')
      .select('id, latitude, longitude')
      .eq('schedule_id', scheduleId)
      .lt('order', newOrder)
      .order('order', { ascending: false })
      .limit(1)
      .single();

    // 4. transit 재계산
    if (prevItem?.latitude && currentItem?.latitude) {
      const route = await getRouteDistance(
        { lat: prevItem.latitude, lng: prevItem.longitude },
        { lat: currentItem.latitude, lng: currentItem.longitude },
        transitMode,
      );

      if (route) {
        await supabase.rpc('update_plan_item_transit', {
          p_item_id: prevItem.id,
          p_transit_time: route.durationMinutes,
          p_transit_distance: route.distanceMeters / 1000,
          p_transit_mode: transitMode,
        });
      } else {
        // ferry, airplane 등 계산 불가한 경우 초기화
        await supabase.rpc('clear_plan_item_transit', {
          p_item_id: prevItem.id,
        });
      }
    }

    return { data: true };
  } catch (error: any) {
    console.error('❌ reorderPlanItem 에러:', error);
    if (error.code === '42501') return { error: 'UNAUTHORIZED' };
    return { error: error.message };
  }
};
