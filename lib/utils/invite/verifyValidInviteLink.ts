'use client';

import { ResourceType } from '@/types/invite';

type ValidateInviteLinkResult =
  | { valid: true; url: URL; resourceId: string; token: string }
  | { valid: false; error: string };

export const validateInviteLink = (link: string, type: ResourceType): ValidateInviteLinkResult => {
  if (!link.trim()) return { valid: false, error: '링크를 정확히 입력해주세요.' };

  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return { valid: false, error: '올바른 형식의 링크가 아닙니다.' };
  }

  if (url.origin !== window.location.origin) {
    return { valid: false, error: '유효하지 않은 링크입니다.' };
  }

  if (!url.searchParams.get('invite_token')) {
    return { valid: false, error: '올바른 초대 링크가 아닙니다. 링크를 다시 확인해주세요.' };
  }

  const prefix = type === 'plan' ? '/plan/' : '/places/';
  if (!url.pathname.startsWith(prefix)) {
    return { valid: false, error: `${type === 'plan' ? '계획' : '장소 리스트'}에 해당하는 초대 링크가 아닙니다.` };
  }

  const resourceId = url.pathname.slice(prefix.length).split('/')[0];
  const token = url.searchParams.get('invite_token')!;

  return { valid: true, url, resourceId, token };
};
