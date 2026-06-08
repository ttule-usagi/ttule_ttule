import { createNewPlaceList } from '@/lib/actions/placeList';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreatePlaceList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewPlaceList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['place-list'] });
    },
  });
};
