import type { SupabaseClient } from '@supabase/supabase-js';

import { toCamelKey } from '@/lib/utils/toCamelCase';
import { RpcError, RpcErrorMessage } from '@/types/errors';
import { UserInfo } from '@/types/user';

export const getUserInfo = async ({ supabase }: { supabase: SupabaseClient }): Promise<UserInfo> => {
  const { data, error } = await supabase.from('profiles').select('username, profile_image_url, email').single();

  if (error) throw new RpcError(error.message as RpcErrorMessage, error.code);

  return toCamelKey(data);
};
