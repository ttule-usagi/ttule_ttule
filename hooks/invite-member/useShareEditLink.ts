import { useCallback } from 'react';
import { useGetOrRefreshEditToken } from './useGetOrRefreshEditToken';
import { useModalStore } from '@/lib/store/modalStore';
import { RESOURCE_ROUTE } from '@/lib/constants/inviteResourceType';
import { ResourceType } from '@/types/invite';

export const useShareEditLink = () => {
  const { mutate: refreshToken, isPending } = useGetOrRefreshEditToken();
  const { open } = useModalStore();

  const createShareLink = useCallback(
    (id: string, type: ResourceType) => {
      refreshToken(
        { id, type },
        {
          onSuccess: (token) => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            if (!baseUrl) {
              console.error('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다.');
              open({
                type: 'error',
                props: {
                  title: '초대 링크 생성 실패',
                  description: '초대 링크를 생성하는 도중 문제가 발생했습니다. \n 잠시 후 다시 시도해주세요.',
                },
              });
              return;
            }
            const editLink = `${baseUrl}/${RESOURCE_ROUTE[type]}/${id}?invite_token=${token}`;
            open({ type: 'shareLink', props: { type: 'EDIT', link: editLink } });
          },
          onError: (error) => {
            console.error(error);
            open({
              type: 'error',
              props: {
                title: '초대 링크 생성 실패',
                description: '초대 링크 생성에 실패했습니다.\n잠시 후 다시 시도해주세요.',
              },
            });
          },
        },
      );
    },
    [refreshToken, open],
  );

  return { createShareLink, isPending };
};
