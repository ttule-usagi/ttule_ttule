import { Icon } from '@/components/common/Icon';
import ShareOptionContent from '@/components/common/ShareOption/ShareOptionContent';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { createPortal } from 'react-dom';

export default function PlaceListShareOptionModal({ id, onClose }: { id: string; onClose: () => void }) {
  return createPortal(
    <div
      className='modal-overlay'
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className='flex flex-col gap-7 bg-white rounded-lg relative pt-7 px-6 pb-6 min-h-100 max-h-[80vh] min-w-140'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='flex justify-between items-center shrink-0'>
          <p className='text-typo-title font-medium text-brand-blue-800'>장소 리스트 공유 설정</p>
          <Icon
            name='XClose'
            size={32}
            className='text-brand-gray-500 cursor-pointer'
            onClick={onClose}
          />
        </header>
        <QueryBoundary subject='공유 옵션 조회'>
          <ShareOptionContent
            id={id}
            resourceType='place_list'
          />
        </QueryBoundary>
      </div>
    </div>,
    document.body,
  );
}
