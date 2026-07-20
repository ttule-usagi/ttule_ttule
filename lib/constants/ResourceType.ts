import { ResourceType } from '@/types/invite';

export const RESOURCE_ROUTE: Record<ResourceType, string> = {
  place_list: 'places',
  plan: 'plan',
};

export const RESOURCE_QUERY_KEY: Record<ResourceType, string> = {
  place_list: 'place-list',
  plan: 'plan',
};
