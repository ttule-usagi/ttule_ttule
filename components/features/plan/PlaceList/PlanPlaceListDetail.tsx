import { useGetPlaceListPlaces } from '@/hooks/place-list/useGetPlaceListDetail';
import { Icon } from '@/components/common/Icon';
import PlanPlaceItem from './PlanPlaceListDetailItem';

interface PlanPlaceListDetailProps {
  listId: string;
  title: string;
  planId: string;
  onBack: () => void;
}

export default function PlanPlaceListDetail({ listId, title, planId, onBack }: PlanPlaceListDetailProps) {
  const { data: places } = useGetPlaceListPlaces(listId);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-row justify-between'>
        <button
          onClick={onBack}
          className='flex items-center gap-1 text-brand-blue-700 text-typo-description'
        >
          <Icon
            name='ChevronLeft'
            size={20}
            className='text-brand-blue-700'
          />
          목록으로
        </button>
        <p className='text-typo-sub-title font-semibold text-brand-gray-700'>{title}</p>
      </div>

      {places.length === 0 ? (
        <p className='text-typo-description text-brand-gray-400'>저장된 장소가 아직 없습니다.</p>
      ) : (
        places.map((place) => (
          <PlanPlaceItem
            key={place.id}
            place={place}
            planId={planId}
          />
        ))
      )}
    </div>
  );
}
