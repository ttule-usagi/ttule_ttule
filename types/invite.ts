export type ResourceType = 'plan' | 'place_list';
export type TokenVerifyResult = 'ALREADY_JOINED' | 'INVALID' | 'VALID' | 'EXPIRED';

export interface TokenVerifyParams {
  id: string;
  type: ResourceType;
}

export interface AddEditMemberParams extends TokenVerifyParams {
  token: string;
}

// 초대 관련 훅(useInviteEditorHandler)에서 사용하는 타입
export interface InviteHookParams {
  id: string;
  resourceType: ResourceType;
}
