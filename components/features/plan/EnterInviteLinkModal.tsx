'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import ModalBox from '@/components/common/Modal/ModalBox';
import { setInviteRedirectCookie, verifyInviteToken } from '@/lib/actions/invite';
import { INVITE_ERROR_MESSAGES, InviteErrorCode } from '@/lib/constants/inviteErrorMessage';
import { useModalStore } from '@/lib/store/modalStore';
import { validateInviteLink } from '@/lib/utils/invite/verifyValidInviteLink';
import { ResourceType } from '@/types/invite';

export default function EnterInviteLinkModal({ type }: { type: ResourceType }) {
  const router = useRouter();
  const [link, setLink] = useState<string>('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { open, close } = useModalStore();
  const { status } = useSession();
  const hasSession = status === 'authenticated';

  const handleSubmit = async (link: string) => {
    // 유효한 링크인지 검증
    const isValidLink = validateInviteLink(link, type);
    if (!isValidLink.valid) {
      setErrorText(isValidLink.error);
      return;
    }

    setIsSubmitting(true);
    // verifyInviteToken() 에러 발생 시 isSubmitting 상태가 계속 true로 남는 것을 방지
    let tokenStatus;
    try {
      tokenStatus = await verifyInviteToken({ token: isValidLink.token, id: isValidLink.resourceId, type });
    } finally {
      setIsSubmitting(false);
    }

    if (tokenStatus === 'INVALID' || tokenStatus === 'EXPIRED') {
      close();
      open({
        type: 'error',
        props: INVITE_ERROR_MESSAGES[type][tokenStatus as InviteErrorCode],
      });
      return;
    }

    isValidLink.url.searchParams.set('from', 'modal');
    const destination = isValidLink.url.pathname + isValidLink.url.search;

    if (!hasSession) {
      await setInviteRedirectCookie(destination); // destination = pathname + search (invite_token 포함)
      close();
      router.push('/login');
      return;
    }

    router.push(destination);
    setErrorText(null);
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && !isSubmitting) {
      handleSubmit(link);
    }
  };

  return (
    <ModalBox width={560}>
      <ModalBox.ModalTitle
        title='초대 링크 입력하기'
        description={`초대받은 ${type === 'plan' ? '여행 계획' : '장소 리스트'}의 공유 링크를 입력해주세요`}
      />

      <div className='flex flex-col gap-1'>
        <p className='text-typo-caption text-brand-gray-400'>초대 링크</p>

        <ModalBox.ModalBottomContent classname='flex flex-col gap-2 xl:flex-row lg:gap-2.5'>
          <input
            className='w-full modal-input min-w-0'
            placeholder='링크 입력하기'
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className='modal-button xl:w-32'
            onClick={() => handleSubmit(link)}
            disabled={isSubmitting}
          >
            {isSubmitting ? '확인중...' : '확인'}
          </button>
        </ModalBox.ModalBottomContent>
        {errorText && <p className='text-typo-description text-tag-red-text'>{errorText}</p>}
      </div>
    </ModalBox>
  );
}
