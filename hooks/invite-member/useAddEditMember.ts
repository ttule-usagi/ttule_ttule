import { addEditMember } from '@/lib/actions/invite';
import { AddEditMemberParams } from '@/types/invite';
import { useMutation } from '@tanstack/react-query';

export const useAddEditMember = () => {
  return useMutation({
    mutationFn: (params: AddEditMemberParams) => addEditMember(params),
  });
};
