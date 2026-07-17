import { ResourceType } from './invite';

export type Role = 'master' | 'editor';

export interface ResourceParams {
  id: string;
  resourceType: ResourceType;
}

export interface SetPublicParams extends ResourceParams {
  isPublic: boolean;
}

export interface DeleteMemberParams extends ResourceParams {
  targetUserId: string;
}

export interface Member {
  id: string;
  username: string;
  profileImageUrl: string;
  role: Role;
}
