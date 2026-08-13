'use server';

import { auth } from '@/lib/utils/auth';
import { supabaseUser } from '@/lib/utils/supabase';
import { ActionResult, isPostgresError, RpcErrorMessage, SQLSTATE_TO_RPC_ERROR } from '@/types/errors';

// 새로운 계획 생성
export async function createNewPlan(formData: {
  title: string;
  destination: string;
  departure_date: string | null;
  arrival_date: string | null;
  is_date_undecided: boolean;
  total_days: number | null;
}): Promise<ActionResult<{ planId: string }>> {
  // 인증 확인
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('인증 정보가 없습니다.');
  }

  // 날짜 유효성 검사 및 총 일수 계산
  let totalDays = formData.total_days ?? 1;

  if (!formData.is_date_undecided) {
    if (!formData.departure_date || !formData.arrival_date) {
      throw new Error('출발 혹은 도착 날짜를 지정해주세요');
    }

    const start = new Date(formData.departure_date);
    const end = new Date(formData.arrival_date);

    if (start > end) {
      return {
        success: false,
        error: {
          message: 'VALIDATION_ERROR' as RpcErrorMessage,
          code: 'INVALID_DATE_RANGE',
        },
      };
    }

    // 날짜 차이 계산 (시간차 무시를 위해 UTC 혹은 정오 기준 계산 권장)
    const diffTime = end.getTime() - start.getTime();
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // 2. 최소 1일 보장
  totalDays = Math.max(1, totalDays);

  try {
    const supabase = await supabaseUser();

    // 3. RPC 호출
    const { data, error } = await supabase.rpc('create_plan', {
      p_title: formData.title,
      p_destination: formData.destination,
      p_departure_date: formData.departure_date,
      p_arrival_date: formData.arrival_date,
      p_is_date_undecided: formData.is_date_undecided,
      p_total_days: totalDays,
    });

    if (error) throw error;
    if (!data) throw new Error('계획 생성 후 ID를 반환받지 못했습니다.');
    const result = (data as { new_plan_id: string }[])[0];

    if (!result?.new_plan_id) {
      return { success: false, error: { message: 'INTERNAL_ERROR' as RpcErrorMessage } };
    }

    return { success: true, data: { planId: result.new_plan_id } };
  } catch (error: unknown) {
    console.error('Plan 생성 실패:', error);
    const code = isPostgresError(error) ? error.code : undefined;
    const message = ((code && SQLSTATE_TO_RPC_ERROR[code]) ?? 'INTERNAL_ERROR') as RpcErrorMessage;
    return { success: false, error: { message, code } };
  }
}

// 계획 삭제
export async function deletePlan(planId: string): Promise<ActionResult<null>> {
  try {
    const supabase = await supabaseUser();
    const { error } = await supabase.rpc('delete_plan', {
      p_plan_id: planId,
    });

    if (error) {
      console.error('❌ 계획 삭제 실패: ', error);
      const message = SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR';
      return { success: false, error: { message, code: error.code } };
    }

    return { success: true, data: null };
  } catch (error: unknown) {
    console.error('❌ 계획 삭제 실패: ', error);
    const code = isPostgresError(error) ? error.code : undefined;
    const message = ((code && SQLSTATE_TO_RPC_ERROR[code]) ?? 'INTERNAL_ERROR') as RpcErrorMessage;
    return { success: false, error: { message, code } };
  }
}

// 계획 정보 업데이트
export const updatePlanInfo = async (params: {
  planId: string;
  title: string;
  destination: string;
  departureDate: string | null;
  arrivalDate: string | null;
  isDateUndecided: boolean;
  totalDays: number;
}): Promise<ActionResult<null>> => {
  const supabase = await supabaseUser();
  const { error } = await supabase.rpc('update_plan_info', {
    p_plan_id: params.planId,
    p_title: params.title,
    p_destination: params.destination,
    p_departure_date: params.departureDate,
    p_arrival_date: params.arrivalDate,
    p_is_date_undecided: params.isDateUndecided,
    p_total_days: params.totalDays,
  });

  if (error) {
    return {
      success: false,
      error: { message: SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR', code: error.code },
    };
  }
  return { success: true, data: null };
};

// 일정표 기준 전체 일정 리셋
export const clearScheduleItems = async (scheduleId: string): Promise<ActionResult<null>> => {
  const supabase = await supabaseUser();
  const { error } = await supabase.rpc('clear_schedule_items', { p_schedule_id: scheduleId });
  if (error) {
    return {
      success: false,
      error: { message: SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR', code: error.code },
    };
  }
  return { success: true, data: null };
};

// 계획 일정표 삭제
export const deletePlanSchedule = async (scheduleId: string): Promise<ActionResult<null>> => {
  const supabase = await supabaseUser();
  const { error } = await supabase.rpc('delete_plan_schedule', { p_schedule_id: scheduleId });
  if (error) {
    return {
      success: false,
      error: { message: SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR', code: error.code },
    };
  }
  return { success: true, data: null };
};

// 계획 일정표 날짜 옮김
export const reorderPlanSchedule = async (scheduleId: string, newDayNumber: number): Promise<ActionResult<null>> => {
  const supabase = await supabaseUser();
  const { error } = await supabase.rpc('reorder_plan_schedule', {
    p_schedule_id: scheduleId,
    p_new_day_number: newDayNumber,
  });

  if (error) {
    return {
      success: false,
      error: { message: SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR', code: error.code },
    };
  }
  return { success: true, data: null };
};

// 계획 일정표 복제
export const duplicatePlan = async (planId: string): Promise<ActionResult<{ id: string }>> => {
  const supabase = await supabaseUser();
  const { error, data } = await supabase.rpc('duplicate_plan', { p_plan_id: planId });

  if (error) {
    return {
      success: false,
      error: { message: SQLSTATE_TO_RPC_ERROR[error.code] ?? 'INTERNAL_ERROR', code: error.code },
    };
  }

  return { success: true, data: { id: data } };
};
