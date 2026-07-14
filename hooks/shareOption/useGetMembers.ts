import { getMembers } from '@/lib/api/shareOption';
import { RESOURCE_QUERY_KEY } from '@/lib/constants/ResourceType';
import { ResourceParams } from '@/types/shareOption';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

export const membersQueryOptions = ({ id, resourceType }: ResourceParams) => {
  return queryOptions({
    queryKey: ['members', RESOURCE_QUERY_KEY[resourceType], id],
    queryFn: () => getMembers({ id, resourceType }),
  });
};

export const useGetMembers = ({ id, resourceType }: ResourceParams) => {
  return useSuspenseQuery(membersQueryOptions({ id, resourceType }));
};
