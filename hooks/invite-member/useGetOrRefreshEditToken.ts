import { verifyEditToken } from '@/lib/actions/invite';
import { TokenVerifyParams } from '@/types/invite';
import { useMutation } from '@tanstack/react-query';

export const useGetOrRefreshEditToken = () => {
  return useMutation({
    mutationFn: (params: TokenVerifyParams) => verifyEditToken(params),
  });
};
