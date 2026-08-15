'use server';

import { supabaseUser } from '@/lib/utils/supabase';
import type { CorePlaceDetail } from '@/types/corePlace';
import { ActionResult, SQLSTATE_TO_RPC_ERROR } from '@/types/errors';
import { Place } from '@/types/placeList';
import { PlanItem, PlanTransitMode } from '@/types/plan';

import { getRouteDistance } from '../utils/googleRoutes';

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

  const { data, error } = await supabase.rpc('duplicate_plan_item', {
    p_item_id: item.id,
  });

  if (error) {
    console.error('❌ duplicatePlanItem 에러:', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  const result = (data as { new_item_id: string }[])[0];

  return { success: true, data: result.new_item_id };
};

// 일정 추가 + transit 계산
// 1. 공통 로직 — 원시 필드만 받음
interface InsertPlanItemParams {
  scheduleId: string;
  corePlaceId: string;
  thumbnail: string | null;
  order?: number;
  transitMode?: PlanTransitMode;
}

const insertPlanItemWithTransit = async (params: InsertPlanItemParams): Promise<ActionResult<string>> => {
  const { scheduleId, corePlaceId, thumbnail, order, transitMode = 'transit' } = params;
  const supabase = await supabaseUser();

  const { data, error } = await supabase.rpc('add_plan_item', {
    p_schedule_id: scheduleId,
    p_core_place_id: corePlaceId,
    p_place_thumbnail: thumbnail,
    p_order: order ?? null,
  });

  if (error) {
    console.error('❌ add_plan_item 에러:', error);
    const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
    return { success: false, error: { message, code: error.code } };
  }

  const result = (
    data as {
      new_item_id: string;
      current_latitude: number;
      current_longitude: number;
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

  if (result.prev_item_id && result.prev_latitude && result.prev_longitude) {
    const route = await getRouteDistance(
      { lat: result.prev_latitude, lng: result.prev_longitude, googlePlaceId: result.prev_google_place_id },
      { lat: result.current_latitude, lng: result.current_longitude, googlePlaceId: result.current_google_place_id },
      transitMode,
    );
    if (route) {
      await supabase.rpc('update_plan_item_transit', {
        p_item_id: result.prev_item_id,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: transitMode,
      });
    }
  }

  if (result.next_item_id && result.next_latitude && result.next_longitude) {
    const route = await getRouteDistance(
      { lat: result.current_latitude, lng: result.current_longitude, googlePlaceId: result.current_google_place_id },
      { lat: result.next_latitude, lng: result.next_longitude, googlePlaceId: result.next_google_place_id },
      transitMode,
    );
    if (route) {
      await supabase.rpc('update_plan_item_transit', {
        p_item_id: result.new_item_id,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: transitMode,
      });
    }
  }

  return { success: true, data: result.new_item_id };
};

// 2. 기존 — CorePlaceDetail용 (검색 결과에서 추가)
export const addPlanItemWithTransit = async ({
  scheduleId,
  placeDetail,
  order,
  transitMode = 'transit',
}: {
  scheduleId: string;
  placeDetail: CorePlaceDetail;
  order?: number;
  transitMode?: PlanTransitMode;
}): Promise<ActionResult<string>> => {
  const { place, images } = placeDetail;
  const mainImage = images.find((img) => img.isMain) ?? images[0];

  return insertPlanItemWithTransit({
    scheduleId,
    corePlaceId: place.id,
    thumbnail: mainImage?.imgUrl ?? null,
    order,
    transitMode,
  });
};

// 3. 신규 — Place(장소 리스트 아이템)용, 드래그로 추가할 때 사용
export const addPlanItemFromPlaceListItem = async ({
  scheduleId,
  place,
  order,
  transitMode = 'transit',
}: {
  scheduleId: string;
  place: Place;
  order?: number;
  transitMode?: PlanTransitMode;
}): Promise<ActionResult<string>> => {
  return insertPlanItemWithTransit({
    scheduleId,
    corePlaceId: place.corePlaceId,
    thumbnail: place.thumbnail,
    order,
    transitMode,
  });
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
export const movePlanItem = async ({
  itemId,
  newOrder,
  targetScheduleId,
  transitMode = 'transit',
}: {
  itemId: string;
  newOrder?: number;
  targetScheduleId?: string;
  transitMode?: PlanTransitMode;
}): Promise<ActionResult<null>> => {
  const supabase = await supabaseUser();

  const { data, error } = await supabase.rpc('move_plan_item', {
    p_item_id: itemId,
    p_new_order: newOrder ?? null,
    p_target_schedule_id: targetScheduleId,
  });

  if (error) {
    console.error('❌ movePlanItem 에러:', error);
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
      old_prev_item_id: string | null;
      old_prev_latitude: number | null;
      old_prev_longitude: number | null;
      old_prev_google_place_id: string | null;
      old_next_item_id: string | null;
      old_next_latitude: number | null;
      old_next_longitude: number | null;
      old_next_google_place_id: string | null;
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

  // 이동 전 자리에 생긴 빈틈: old_prev ↔ old_next 직접 연결
  if (
    result.old_prev_item_id &&
    result.old_next_item_id &&
    result.old_next_item_id !== result.next_item_id
    //  && result.old_prev_item_id !== result.prev_item_id
  ) {
    const route = await getRouteDistance(
      {
        lat: result.old_prev_latitude!,
        lng: result.old_prev_longitude!,
        googlePlaceId: result.old_prev_google_place_id,
      },
      {
        lat: result.old_next_latitude!,
        lng: result.old_next_longitude!,
        googlePlaceId: result.old_next_google_place_id,
      },
      transitMode,
    );

    if (route) {
      await supabase.rpc('update_plan_item_transit', {
        p_item_id: result.old_prev_item_id,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: transitMode,
      });
    } else {
      await supabase.rpc('clear_plan_item_transit', { p_item_id: result.old_prev_item_id });
    }
  } else if (result.old_prev_item_id && !result.old_next_item_id) {
    // 이동한 아이템이 원래 그 일차의 마지막 place였던 경우: old_prev가 이제 마지막이 되므로 transit 제거
    await supabase.rpc('clear_plan_item_transit', { p_item_id: result.old_prev_item_id });
  }

  return { success: true, data: null };
};

// plan item 수정
type UpdatePlanItemParams =
  | { type: 'place'; itemId: string; visitTime: string; memoContent: string }
  | { type: 'memo'; placeName: string; itemId: string; visitTime: string; memoContent: string };

export const updatePlanItem = async (params: UpdatePlanItemParams): Promise<ActionResult<null>> => {
  const supabase = await supabaseUser();

  if (params.type === 'place') {
    const { error } = await supabase.rpc('update_plan_item_place', {
      p_item_id: params.itemId,
      p_visit_time: params.visitTime,
      p_memo_content: params.memoContent,
    });
    if (error)
      return {
        success: false,
        error: { message: SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR', code: error.code },
      };
    return { success: true, data: null };
  }

  const { error } = await supabase.rpc('update_plan_item_memo', {
    p_item_id: params.itemId,
    p_place_name: params.placeName,
    p_visit_time: params.visitTime,
    p_memo_content: params.memoContent,
  });
  if (error)
    return {
      success: false,
      error: { message: SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR', code: error.code },
    };
  return { success: true, data: null };
};

// 장소 붙여넣기
export const pastePlanItems = async (
  sourceScheduleId: string,
  targetScheduleId: string,
  transitMode: PlanTransitMode = 'transit',
): Promise<ActionResult<null>> => {
  const supabase = await supabaseUser();
  const { data, error } = await supabase.rpc('paste_plan_items', {
    p_source_schedule_id: sourceScheduleId,
    p_target_schedule_id: targetScheduleId,
  });

  if (error) {
    return {
      success: false,
      error: { message: SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR', code: error.code },
    };
  }

  const result = (
    data as {
      last_existing_item_id: string | null;
      last_existing_latitude: number | null;
      last_existing_longitude: number | null;
      last_existing_google_place_id: string | null;
      first_pasted_latitude: number | null;
      first_pasted_longitude: number | null;
      first_pasted_google_place_id: string | null;
    }[]
  )[0];

  // 기존 마지막 아이템 → 붙여넣은 첫 아이템, 경계 구간만 재계산
  if (result.last_existing_item_id && result.first_pasted_latitude) {
    const route = await getRouteDistance(
      {
        lat: result.last_existing_latitude!,
        lng: result.last_existing_longitude!,
        googlePlaceId: result.last_existing_google_place_id,
      },
      {
        lat: result.first_pasted_latitude,
        lng: result.first_pasted_longitude!,
        googlePlaceId: result.first_pasted_google_place_id,
      },
      transitMode,
    );

    if (route) {
      await supabase.rpc('update_plan_item_transit', {
        p_item_id: result.last_existing_item_id,
        p_transit_time: route.durationMinutes,
        p_transit_distance: route.distanceMeters / 1000,
        p_transit_mode: transitMode,
      });
    }
  }

  return { success: true, data: null };
};

interface UpdatePlanItemTransitMemoProps {
  placeId: string;
  transitMode: PlanTransitMode;
  transitDistance: number | null;
  transitTime: number | null;
  transitMemo: string | null;
}

export const updatePlanItemTransitMemo = async (
  params: UpdatePlanItemTransitMemoProps,
): Promise<ActionResult<null>> => {
  const { placeId, transitMode, transitDistance, transitTime, transitMemo } = params;
  const supabase = await supabaseUser();

  const { error } = await supabase.rpc('update_plan_item_transit_memo', {
    p_item_id: placeId,
    p_transit_time: transitTime,
    p_transit_distance: transitDistance !== null ? transitDistance / 1000 : null,
    p_transit_mode: transitMode,
    p_transit_memo: transitMemo,
  });

  if (error) {
    return {
      success: false,
      error: { message: SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR', code: error.code },
    };
  }
  return { success: true, data: null };
};
