import { auth } from '@/lib/utils/auth';
import { createSupabaseServerClient } from '@/lib/utils/supabase';

export { auth as proxy };

// 보호할 라우트(로그인 없이 접근 불가)
export const config = {
  matcher: ['/lobby/:path*', '/places/:path*'],
};

// supabase 전용 인증 래퍼
export const supabaseProxy = async <T>(
  fetcher: (supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) => Promise<T>,
): Promise<T> => {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  const supabase = await createSupabaseServerClient();
  return fetcher(supabase);
};
