'use client';

import { useInviteEditorHandler } from '@/hooks/invite-member/useInviteEditorHandler';
import { ResourceType } from '@/lib/actions/invite';

export default function InviteTokenHandler({ type }: { type: ResourceType }) {
  useInviteEditorHandler(type);
  return null;
}
