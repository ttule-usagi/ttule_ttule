import { QueryClient } from '@tanstack/react-query';

import { userInfoQueryOptions } from '@/hooks/user/useGetUserInfo';
import { supabaseUser } from '@/lib/utils/supabase';

import { getUserInfo } from '../user';

export async function prefetchUserInfo(queryClient: QueryClient) {
  const supabase = await supabaseUser();

  await queryClient.prefetchQuery({
    ...userInfoQueryOptions(),
    queryFn: () => getUserInfo({ supabase }),
  });
}
