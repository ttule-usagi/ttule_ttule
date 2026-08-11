import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';
import { UserInfo } from '@/types/user';

const fetchUserInfo = async (): Promise<UserInfo> => {
  const res = await fetch(`/api/view/user`);

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }

  return res.json();
};

export const userInfoQueryOptions = () => {
  return queryOptions({
    queryKey: ['user', 'info'],
    queryFn: () => fetchUserInfo(),
  });
};

export const useGetUserInfo = () => {
  return useSuspenseQuery(userInfoQueryOptions());
};
