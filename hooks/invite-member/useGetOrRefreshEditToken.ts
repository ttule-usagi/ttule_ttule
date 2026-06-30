import { ResourceType, verifyEditToken } from '@/lib/actions/invite';
import { useMutation } from '@tanstack/react-query';

export const useGetOrRefreshEditToken = () => {
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: ResourceType }) => verifyEditToken(id, type),
  });
};
