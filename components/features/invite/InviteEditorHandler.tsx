'use client';

import { useInviteEditorHandler } from '@/hooks/invite-member/useInviteEditorHandler';
import { ResourceType } from '@/types/invite';

// router를 사용하는 훅을 실행시키기 위한 컴포넌트로, 아무것도 반환하지 X
export default function InviteEditorHandler({ id, type }: { id: string; type: ResourceType }) {
  useInviteEditorHandler(id, type);
  return null;
}
