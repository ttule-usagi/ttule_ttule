import type { SupabaseClient } from '@supabase/supabase-js';
import type { PlanDetail, PlanItem, PlanSchedule } from '@/types/plan';
import { PlanScheduleOverview } from '@/hooks/plan/useGetPlanSchedules';

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

  if (error) throw error;
  if (!data) throw new Error('계획 정보를 가져오는 데 실패했습니다.');
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

  if (error) throw error;
  if (!data) throw new Error('일정 항목을 가져오는 데 실패했습니다.');
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

  if (error) throw error;
  if (!data) throw new Error('일정을 가져오는 데 실패했습니다.');
  return data as PlanSchedule[];
};
