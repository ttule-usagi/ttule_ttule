export type ResourceType = 'plan' | 'place_list';

export interface TokenVerifyParams {
  id: string;
  type: ResourceType;
}

export interface AddEditMemberParams extends TokenVerifyParams {
  token: string;
}
