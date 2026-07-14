import { RESOURCE_ROUTE } from '@/lib/constants/ResourceType';
import { ResourceType } from '@/types/invite';

export const createViewLink = (id: string, type: ResourceType) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return `${baseUrl}/${RESOURCE_ROUTE[type]}/${id}`;
};
