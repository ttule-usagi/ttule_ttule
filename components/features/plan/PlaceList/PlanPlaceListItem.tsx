import { PlaceListOverview } from '@/types/placeList';
import { Icon } from '@/components/common/Icon';

export function PlanPlaceListItem({ place, onClick }: { place: PlaceListOverview; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className='w-full flex justify-between items-center wobbly-box px-3 py-4'
    >
      <div className='flex flex-col gap-1 items-start'>
        <div className='flex items-center gap-2 text-brand-blue-700'>
          {place.icon && <span className='font-mona12 text-emoji-title'>{place.icon}</span>}
          <span className='text-typo-sub-title font-medium'>{place.title}</span>
        </div>
        <div className='flex gap-2 text-typo-description font-light text-brand-gray-400'>
          <span>{place.isPublic ? '공유 목록' : '비공개'}</span>
          <span>장소 {place.placeCount}개</span>
        </div>
      </div>
      <Icon
        name='ChevronRight'
        size={20}
        className='text-brand-gray-400 shrink-0'
      />
    </button>
  );
}
