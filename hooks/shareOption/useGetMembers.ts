import { RESOURCE_QUERY_KEY } from '@/lib/constants/ResourceType';
import { RpcError } from '@/types/errors';
import { Member, ResourceParams } from '@/types/shareOption';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

export const membersQueryOptions = ({ id, resourceType }: ResourceParams) => {
  return queryOptions({
    queryKey: ['members', RESOURCE_QUERY_KEY[resourceType], id],
    queryFn: async () => {
      const res = await fetch(`/api/view/members?id=${id}&resourceType=${resourceType}`);

      if (res.status === 403) throw new RpcError('참여 유저 목록을 불러올 수 없습니다.');
      if (!res.ok) throw new RpcError('참여 유저 목록을 불러오는 중 오류가 발생했습니다.');

      return res.json() as Promise<Member[]>;
    },
  });
};

export const useGetMembers = ({ id, resourceType }: ResourceParams) => {
  return useSuspenseQuery(membersQueryOptions({ id, resourceType }));
};
