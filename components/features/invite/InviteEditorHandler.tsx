'use client';

import { useInviteEditorHandler } from '@/hooks/invite-member/useInviteEditorHandler';
import { InviteHookParams } from '@/types/invite';

// router를 사용하는 훅을 실행시키기 위한 컴포넌트로, 아무것도 반환하지 X
export default function InviteEditorHandler({ id, resourceType }: InviteHookParams) {
  useInviteEditorHandler({ id, resourceType });
  return null;
}
