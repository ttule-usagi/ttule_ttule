import { Icon } from '@/components/common/Icon';
import PlanPlaceItem from './PlanPlaceListDetailItem';
import { useGetPlaceListPlaces } from '@/hooks/place-list/useGetPlaceListPlaces';

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
          className='flex items-center gap-1 text-brand-blue-700 text-typo-description shrink-0'
        >
          <Icon
            name='ChevronLeft'
            size={28}
            className='text-brand-blue-700'
          />
        </button>
        <p className='text-typo-sub-title font-semibold text-brand-gray-700 ml-2 truncate max-w-85'>{title}</p>
      </div>

      {places.length === 0 ? (
        <div className='flex min-h-20 justify-center items-center'>
          <p className='text-typo-description text-brand-gray-400'>저장된 장소가 아직 없습니다.</p>
        </div>
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
