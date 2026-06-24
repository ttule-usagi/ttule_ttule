import { PLACE_CATEGORIES } from '@/types/CorePlace';

export const getPlaceCategoryLabel = (value: string) => {
  return PLACE_CATEGORIES.find((item) => item.value === value)?.label ?? null;
};
