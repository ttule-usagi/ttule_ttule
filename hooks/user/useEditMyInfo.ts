import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { setGoogleAccount } from '@/lib/actions/auth';
import { getProfileImageUrl } from '@/lib/actions/getProfileImageUrl';
import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';

import { userInfoQueryOptions } from './useGetUserInfo';

interface FieldError {
  field?: string;
  message: string;
}

export const useEditMyInfo = () => {
  const queryClient = useQueryClient();
  const [fieldError, setFieldError] = useState<FieldError | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      username,
      newProfileImage,
      currentProfileImage,
    }: {
      username: string;
      newProfileImage: File | null;
      currentProfileImage: string | null;
    }) => {
      let finalImageUrl = currentProfileImage ?? '';

      if (newProfileImage) {
        try {
          finalImageUrl = await getProfileImageUrl(newProfileImage);
        } catch (uploadError) {
          console.error('❌ 프로필 이미지 업로드 실패:', uploadError);
          throw new RpcError(
            'VALIDATION_ERROR' as RpcErrorMessage,
            undefined,
            '이미지 파일을 다시 확인해주세요.',
            'image',
          );
        }
      }

      const result = await setGoogleAccount(username, finalImageUrl);

      if (!result.success) {
        throw new RpcError(result.error.message, result.error.code, result.error.detail, result.error.field);
      }

      return result;
    },
    onSuccess: () => {
      // TODO: 정보 수정 성공 시 toast 메시지 반환 필요
      setFieldError(null);
      queryClient.invalidateQueries({ queryKey: userInfoQueryOptions().queryKey });
    },
    onMutate: () => {
      setFieldError(null);
    },
    onError: (error: unknown) => {
      // 닉네임 유효성 검증 오류는 우선적으로 인라인으로 처리
      if (error instanceof RpcError && error.field) {
        const message =
          error.detail ?? getErrorMessage(error.message as RpcErrorMessage, { subject: '정보', action: '수정' });
        setFieldError({ field: error.field, message });
        return;
      }

      const message =
        error instanceof RpcError
          ? getErrorMessage(error.message as RpcErrorMessage, { subject: '정보', action: '수정' })
          : getErrorMessage('INTERNAL_ERROR', { subject: '정보', action: '수정' });

      // field가 없으면 폼 전체 레벨의 에러
      setFieldError({ field: undefined, message });
    },
  });

  return { ...mutation, fieldError, setFieldError };
};
