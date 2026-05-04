import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/utils/auth';

export const createSupabaseServerClient = async () => {
  const session = await auth();

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: session?.supabaseAccessToken ? `Bearer ${session.supabaseAccessToken}` : '',
      },
    },
  });
};
