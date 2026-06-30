'use client';

import { createClient } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

// 클라이언트에서 직접 supabase를 사용할 때, accessToken을 세션에서 가져와서 설정하는 함수
export const supabaseBrowser = () => {
  const { data: session } = useSession();

  return useMemo(() => {
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      accessToken: async () => session?.supabaseAccessToken ?? null,
    });
  }, [session?.supabaseAccessToken]);
};
