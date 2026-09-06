export const TAG_COLORS = ['hotpink', 'red', 'yellow', 'green', 'blue', 'purple', 'grey'] as const;

export type TagColor = (typeof TAG_COLORS)[number];

// 태그 관리 모달에서 사용할 팔레트 색상
export const TAG_PALETTE: Record<TagColor, string> = {
  red: 'bg-tag-red-stroke',
  hotpink: 'bg-tag-hotpink-stroke',
  blue: 'bg-brand-blue-100',
  yellow: 'bg-tag-yellow-stroke',
  green: 'bg-tag-green-stroke',
  purple: 'bg-tag-purple-stroke',
  grey: 'bg-brand-gray-300',
};

// 단일 장소 컴포넌트에 사용할 태그 색상
export const PLACE_TAG_COLOR: Record<TagColor, string> = {
  red: 'text-tag-red-text bg-tag-red-fill border-tag-red-stroke',
  hotpink: 'text-tag-hotpink-text bg-tag-hotpink-fill border-tag-hotpink-stroke',
  blue: 'text-brand-blue-500 border-brand-blue-100 bg-brand-blue-50',
  yellow: 'text-tag-yellow-text bg-tag-yellow-fill border-tag-yellow-stroke',
  green: 'text-tag-green-text bg-tag-green-fill border-tag-green-stroke',
  purple: 'text-tag-purple-text bg-tag-purple-fill border-tag-purple-stroke',
  grey: 'text-brand-gray-500 bg-brand-gray-50 border-brand-gray-100',
};
