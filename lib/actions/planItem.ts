'use server';

import { supabaseUser } from '@/lib/utils/supabase';
import type { CorePlaceDetail } from '@/types/corePlace';
import { PlanItem, PlanTransitMode } from '@/types/plan';
import { getRouteDistance } from '../utils/googleRoutes';
import { ActionResult, SQLSTATE_TO_RPC_ERROR } from '@/types/errors';

interface AddPlanMemoItemProps {
  scheduleId: string;
  placeName: string;
  memoContent?: string | null;
  visitTime?: string | null;
}

export const addPlanMemoItem = async ({
  scheduleId,
  placeName,
  memoContent,
  visitTime,
}: AddPlanMemoItemProps): Promise<ActionResult<string>> => {
  const supabase = await supabaseUser();

  const { data, error } = await supabase.rpc('add_plan_memo_item', {
    p_schedule_id: scheduleId,
    p_place_name: placeName,
    p_memo_content: memoContent || null,
    p_visit_time: visitTime || null,
  });

  if (error) {
    console.error('❌ add_plan_memo_item 에러:', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  const result = (data as { new_item_id: string }[])[0];
  return { success: true, data: result.new_item_id };
};

export const duplicatePlanItem = async (item: PlanItem): Promise<ActionResult<string>> => {
  const supabase = await supabaseUser();

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

  if (error) {
    console.error('❌ duplicatePlanItem 에러:', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  const result = (
    data as {
      new_item_id: string;
      prev_item_id: string | null;
      prev_latitude: number | null;
      prev_longitude: number | null;
      prev_google_place_id: string | null;
    }[]
  )[0];

  // 이전 장소 아이템이 있으면 transit 계산
  if (result.prev_item_id && result.prev_latitude && result.prev_longitude) {
    const route = await getRouteDistance(
      {
        lat: result.prev_latitude,
        lng: result.prev_longitude,
        googlePlaceId: result.prev_google_place_id,
      },
      {
        lat: item.latitude!,
        lng: item.longitude!,
        googlePlaceId: item.googlePlaceId,
      },
      'transit',
    );

    if (route) {
      await supabase.rpc('update_plan_item_transit', {
        p_item_id: result.prev_item_id,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: 'transit',
      });
    }
  }

  return { success: true, data: result.new_item_id };
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
}): Promise<ActionResult<string>> => {
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

  if (error) {
    console.error('❌ add_plan_item 에러:', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  const result = (
    data as {
      new_item_id: string;
      prev_item_id: string | null;
      prev_latitude: number | null;
      prev_longitude: number | null;
      prev_google_place_id: string | null;
    }[]
  )[0];

  // 2. 이전 장소 아이템 기준 transit 계산
  if (result.prev_item_id && result.prev_latitude && result.prev_longitude) {
    const route = await getRouteDistance(
      { lat: result.prev_latitude, lng: result.prev_longitude, googlePlaceId: result.prev_google_place_id },
      { lat: place.latitude, lng: place.longitude, googlePlaceId: place.googlePlaceId },
      transitMode,
    );

    if (route) {
      const { error: transitError } = await supabase.rpc('update_plan_item_transit', {
        p_item_id: result.prev_item_id,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: transitMode,
      });

      if (transitError) {
        console.error('❌ transit 업데이트 실패 (아이템 추가는 성공):', transitError);
      }
    }
  }

  return { success: true, data: result.new_item_id };
};

// 일정 삭제 + 이전 장소 && 이후 장소가 있을 경우 transit 재계산
export const deletePlanItem = async (itemId: string): Promise<ActionResult<null>> => {
  const supabase = await supabaseUser();

  const { data, error } = await supabase.rpc('delete_plan_item', {
    p_item_id: itemId,
  });

  if (error) {
    console.error('❌ delete_plan_item 에러:', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  const result = (
    data as {
      prev_item_id: string | null;
      prev_latitude: number | null;
      prev_longitude: number | null;
      prev_google_place_id: string | null;
      next_item_id: string | null;
      next_latitude: number | null;
      next_longitude: number | null;
      next_google_place_id: string | null;
    }[]
  )[0];

  // 이전/이후 장소 둘 다 있으면 transit 재계산
  if (result.prev_item_id && result.next_item_id && result.prev_latitude && result.next_latitude) {
    const route = await getRouteDistance(
      {
        lat: result.prev_latitude,
        lng: result.prev_longitude!,
        googlePlaceId: result.prev_google_place_id,
      },
      {
        lat: result.next_latitude,
        lng: result.next_longitude!,
        googlePlaceId: result.next_google_place_id,
      },
      'transit',
    );

    if (route) {
      const { error: transitError } = await supabase.rpc('update_plan_item_transit', {
        p_item_id: result.prev_item_id,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: 'transit',
      });
      if (transitError) {
        console.error('❌ transit 업데이트 실패 (삭제는 성공):', transitError);
      }
    }
  }

  return { success: true, data: null };
};

// 순서 변경 + transit 재계산
export const reorderPlanItem = async ({
  itemId,
  newOrder,
  transitMode = 'transit',
}: {
  itemId: string;
  newOrder: number;
  transitMode?: PlanTransitMode;
}): Promise<ActionResult<null>> => {
  const supabase = await supabaseUser();

  const { data, error } = await supabase.rpc('reorder_plan_item', {
    p_item_id: itemId,
    p_new_order: newOrder,
  });

  if (error) {
    console.error('❌ reorderPlanItem 에러:', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  const result = (
    data as {
      current_latitude: number | null;
      current_longitude: number | null;
      current_google_place_id: string | null;
      prev_item_id: string | null;
      prev_latitude: number | null;
      prev_longitude: number | null;
      prev_google_place_id: string | null;
      next_item_id: string | null;
      next_latitude: number | null;
      next_longitude: number | null;
      next_google_place_id: string | null;
    }[]
  )[0];

  // 이동한 인덱스 기준 이전 장소 아이템 - 현재 장소 아이템 transit 업데이트
  if (result.prev_item_id && result.current_latitude) {
    const route = await getRouteDistance(
      { lat: result.prev_latitude!, lng: result.prev_longitude!, googlePlaceId: result.prev_google_place_id },
      { lat: result.current_latitude, lng: result.current_longitude!, googlePlaceId: result.current_google_place_id },
      transitMode,
    );

    if (route) {
      await supabase.rpc('update_plan_item_transit', {
        p_item_id: result.prev_item_id,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: transitMode,
      });
    } else {
      await supabase.rpc('clear_plan_item_transit', { p_item_id: result.prev_item_id });
    }
  }

  // 이동한 인덱스 기준 현재 장소 아이템 - 이후 장소 아이템 transit 업데이트
  if (result.next_item_id && result.current_latitude) {
    const route = await getRouteDistance(
      { lat: result.current_latitude, lng: result.current_longitude!, googlePlaceId: result.current_google_place_id },
      { lat: result.next_latitude!, lng: result.next_longitude!, googlePlaceId: result.next_google_place_id },
      transitMode,
    );

    if (route) {
      await supabase.rpc('update_plan_item_transit', {
        p_item_id: itemId,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: transitMode,
      });
    } else {
      await supabase.rpc('clear_plan_item_transit', { p_item_id: itemId });
    }
  }

  return { success: true, data: null };
};
