import { useMutation } from '@tanstack/react-query';
import { createNewPlace } from '@/lib/actions/places';
import type { CreatePlacePayload } from '@/types/CorePlace';

export const useCreatePlace = () => {
  return useMutation({
    mutationFn: async (payload: CreatePlacePayload) => {
      const result = await createNewPlace(payload);
      if (!result.success) throw new Error(result.error);
      return result;
    },
  });
};
