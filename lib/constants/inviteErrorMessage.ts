import { ResourceType } from '@/types/invite';

export type InviteErrorCode = 'INVALID' | 'EXPIRED';

const INVALID_MESSAGE = '초대 링크가 유효하지 않습니다.\n링크를 다시 확인해주세요.';
const EXPIRED_MESSAGE = '초대 링크가 만료되었습니다.';

export const INVITE_ERROR_MESSAGES = {
  place_list: {
    INVALID: {
      title: '장소 리스트 참여 실패',
      description: INVALID_MESSAGE,
    },
    EXPIRED: {
      title: '장소 리스트 참여 실패',
      description: EXPIRED_MESSAGE,
    },
  },
  plan: {
    INVALID: {
      title: '계획 참여 실패',
      description: INVALID_MESSAGE,
    },
    EXPIRED: {
      title: '계획 참여 실패',
      description: EXPIRED_MESSAGE,
    },
  },
} satisfies Record<ResourceType, Record<InviteErrorCode, { title: string; description: string }>>;

// 매핑에 없는 예외 상황 처리
export const DEFAULT_INVITE_ERROR_PROPS = {
  title: '참여 실패',
  description: '요청 처리 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
};
