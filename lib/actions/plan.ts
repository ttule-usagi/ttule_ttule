'use server';

import { auth } from '@/lib/utils/auth';
import { supabaseUser } from '@/lib/utils/supabase';
import { ActionResult, isPostgresError, RpcErrorMessage, SQLSTATE_TO_RPC_ERROR } from '@/types/errors';

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
