'use server';

import { auth } from '@/lib/utils/auth';
import { supabaseAdmin, supabaseUser } from '@/lib/utils/supabase';

export const createNewPlan = async (formData: {
  title: string;
  destination: string;
  departure_date: string | null;
  arrival_date: string | null;
  is_date_undecided: boolean;
  total_days: number | null;
}) => {
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
      return { error: '출발 일자는 도착 일자보다 빠를 수 없습니다.' };
    }

    // 날짜 차이 계산 (시간차 무시를 위해 UTC 혹은 정오 기준 계산 권장)
    const diffTime = end.getTime() - start.getTime();
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // 2. 최소 1일 보장
  totalDays = Math.max(1, totalDays);
  let newId: string | null = null;

  try {
    const supabase = await supabaseAdmin;

    // 3. RPC 호출
    const { data, error } = await supabase.rpc('create_plan', {
      p_title: formData.title,
      p_destination: formData.destination,
      p_departure_date: formData.departure_date,
      p_arrival_date: formData.arrival_date,
      p_is_date_undecided: formData.is_date_undecided,
      p_total_days: totalDays,
      p_user_id: session.user.id,
    });

    if (error) throw error;
    if (!data) throw new Error('계획 생성 후 ID를 반환받지 못했습니다.');
    const result = (data as { new_plan_id: string; new_edit_token: string }[])[0];
    console.log('RPC 호출 결과:', result);

    return {
      data: {
        planId: result.new_plan_id,
        token: result.new_edit_token,
      },
    };
  } catch (error: any) {
    console.error('Plan 생성 실패:', error);
    return { error: error.message || '계획을 생성하는 중 오류가 발생했습니다.' };
  }
};
