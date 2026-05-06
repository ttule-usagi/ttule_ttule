// lib/utils/auth-helpers.ts
import { auth } from '@/lib/utils/auth';
import { createSupabaseServerClient } from '@/lib/utils/supabase';

/**
 * Supabase 전용 서버측 인증 래퍼
 * 서버 컴포넌트나 Server Action에서 세션 체크와 클라이언트 생성을 한 번에 처리
 */
export const supabaseProxy = async <T>(
  fetcher: (supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) => Promise<T>,
): Promise<T> => {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized: 로그인이 필요합니다.');
  }

  const supabase = await createSupabaseServerClient();
  return fetcher(supabase);
};
