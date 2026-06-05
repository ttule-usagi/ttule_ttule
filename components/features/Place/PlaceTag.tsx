import { Icon } from '@/components/common/Icon';
import { Tag } from '@/types/placeList';

// 단일 장소 아이템, 장소 리스트 관리 페이지 안 태그에 사용될 색상 태그 컴포넌트
const colorVariant = {
  RED: 'text-tag-red-text bg-tag-red-fill border-tag-red-stroke',
  HOTPINK: 'text-tag-hotpink-text bg-tag-hotpink-fill border-tag-hotpink-stroke',
  BLUE: 'text-brand-blue-500 border-brand-blue-100 bg-brand-blue-50',
  YELLOW: 'text-tag-yellow-text bg-tag-yellow-fill border-tag-yellow-stroke',
  GREEN: 'text-tag-green-text bg-tag-green-fill border-tag-green-stroke',
  PURPLE: 'text-tag-purple-text bg-tag-purple-fill border-tag-purple-stroke',
  GRAY: 'text-brand-gray-500 bg-brand-gray-50 border-brand-gray-100',
};

interface PlaceTagProps {
  tag: Tag;
  onClick?: () => void;
  isRounded?: boolean;
}

export default function PlaceTag({ tag, onClick, isRounded = false }: PlaceTagProps) {
  return (
    <div
      className={`block shrink-0 text-typo-caption ${isRounded ? 'rounded-[28px]' : 'rounded-sm'} border px-2 py-1 ${colorVariant[tag.color]}`}
      onClick={onClick}
    >
      {onClick && (
        <Icon
          name='Check'
          size={18}
          color={colorVariant[tag.color]}
        />
      )}
      {tag.name}
    </div>
  );
}
