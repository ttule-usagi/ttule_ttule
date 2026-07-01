import { useCallback } from 'react';
import { useGetOrRefreshEditToken } from './useGetOrRefreshEditToken';
import { useModalStore } from '@/lib/store/modalStore';
import { RESOURCE_ROUTE } from '@/lib/constants/inviteResourceType';
import { ResourceType } from '@/types/invite';

export const useShareEditLink = () => {
  const { mutate: refreshToken } = useGetOrRefreshEditToken();
  const { open } = useModalStore();

  const createShareLink = useCallback(
    (id: string, type: ResourceType) => {
      refreshToken(
        { id, type },
        {
          onSuccess: (token) => {
            const editLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${RESOURCE_ROUTE[type]}/${id}?invite_token=${token}`;
            open({ type: 'shareLink', props: { type: 'EDIT', link: editLink } });
          },
        },
      );
    },
    [refreshToken, open],
  );

  return { createShareLink };
};
