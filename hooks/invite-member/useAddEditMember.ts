import { addEditMember, ResourceType } from '@/lib/actions/invite';
import { useMutation } from '@tanstack/react-query';

export const useAddEditMember = () => {
  return useMutation({
    mutationFn: ({ token, type }: { token: string; type: ResourceType }) => addEditMember(token, type),
  });
};
