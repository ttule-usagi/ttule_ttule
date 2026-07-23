import { RESOURCE_QUERY_KEY } from '@/lib/constants/ResourceType';
import { RpcError, RpcErrorMessage, RpcErrorResponseBody } from '@/types/errors';
import { Member, ResourceParams } from '@/types/shareOption';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

const fetchMembers = async ({ id, resourceType }: ResourceParams): Promise<Member[]> => {
  const res = await fetch(`/api/view/members?id=${id}&resourceType=${resourceType}`);

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RpcErrorResponseBody | null;
    const message: RpcErrorMessage = body?.error ?? 'INTERNAL_ERROR';
    throw new RpcError(message);
  }

  return res.json();
};

export const membersQueryOptions = ({ id, resourceType }: ResourceParams) => {
  return queryOptions({
    queryKey: ['members', RESOURCE_QUERY_KEY[resourceType], id],
    queryFn: () => fetchMembers({ id, resourceType }),
  });
};

export const useGetMembers = ({ id, resourceType }: ResourceParams) => {
  return useSuspenseQuery(membersQueryOptions({ id, resourceType }));
};
