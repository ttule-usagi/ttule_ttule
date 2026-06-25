import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/utils/auth';

// 서버 컴포넌트용 (세션 기반, RLS 적용)
export const supabaseUser = async () => {
  const session = await auth();

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: session?.supabaseAccessToken ? `Bearer ${session.supabaseAccessToken}` : '',
      },
    },
  });
};
// 어드민용 (서비스 롤 키, RLS 우회)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
