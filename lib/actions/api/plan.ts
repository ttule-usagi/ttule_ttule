import type { SupabaseClient } from '@supabase/supabase-js';
import type { PlanDetail, PlanItem, PlanSchedule } from '@/types/plan';
import { RpcError, RpcErrorMessage } from '@/types/errors';

export const getPlanDetail = async ({
  supabase,
  planId,
}: {
  supabase: SupabaseClient;
  planId: string;
}): Promise<PlanDetail> => {
  const { data, error } = await supabase.rpc('get_plan_detail_single', {
    p_plan_id: planId,
  });

  if (error) throw new RpcError(error.message as RpcErrorMessage, error.code);

  if (!data) {
    console.error('❌ 계획 상세 조회 실패: ', error);
    throw new RpcError('NOT_FOUND');
  }

  return data as PlanDetail;
};

export const getScheduleItems = async ({
  supabase,
  scheduleId,
}: {
  supabase: SupabaseClient;
  scheduleId: string;
}): Promise<PlanItem[]> => {
  const { data, error } = await supabase.rpc('get_schedule_items', {
    p_schedule_id: scheduleId,
  });

  if (error) throw new RpcError(error.message as RpcErrorMessage, error.code);
  if (!data) {
    console.error('❌ 계획 일차별 아이템 조회 실패: ', error);
    throw new RpcError('NOT_FOUND');
  }
  return data as PlanItem[];
};

export const getPlanSchedules = async ({
  supabase,
  planId,
}: {
  supabase: SupabaseClient;
  planId: string;
}): Promise<PlanSchedule[]> => {
  const { data, error } = await supabase.rpc('get_plan_schedules', {
    p_plan_id: planId,
  });

  if (error) throw new RpcError(error.message as RpcErrorMessage, error.code);
  if (!data) {
    console.error('❌ 계획 스케줄 리스트 조회 실패: ', error);
    throw new RpcError('NOT_FOUND');
  }
  return data as PlanSchedule[];
};
