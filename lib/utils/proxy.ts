import { auth } from '@/lib/utils/auth';
import { createSupabaseServerClient } from '@/lib/utils/supabase';

export const supabaseProxy = async <T>(
  fetcher: (supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) => Promise<T>,
): Promise<T> => {
  // 세션 검증
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // 검증된 클라이언트로 데이터 요청
  const supabase = await createSupabaseServerClient();
  return fetcher(supabase);
};
