import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNewPlace } from '@/lib/actions/places';
import type { CreatePlacePayload } from '@/types/corePlace';
import { RpcError } from '@/types/errors';
export const useCreatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePlacePayload) => {
      const result = await createNewPlace(payload);
      if (!result.success) throw new RpcError(result.error.message, result.error.code, result.error.detail);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['corePlace', 'exists', variables.google_place_id],
      });
    },
  });
};
