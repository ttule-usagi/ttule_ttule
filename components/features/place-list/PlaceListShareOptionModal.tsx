import { createPortal } from 'react-dom';

import { Icon } from '@/components/common/Icon';
import Loader from '@/components/common/Loader';
import ShareOptionContent from '@/components/common/ShareOption/ShareOptionContent';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { useModalControl } from '@/hooks/useModalControl';

export default function PlaceListShareOptionModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { handleMouseDown, handleMouseUp } = useModalControl(onClose);

  return createPortal(
    <div
      className='modal-overlay'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className='flex flex-col gap-1 bg-white rounded-lg relative pt-7 min-h-100 h-187 max-h-[80vh] min-w-126 overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='flex justify-between items-center shrink-0 px-6'>
          <p className='text-typo-title font-medium text-brand-blue-800'>장소 리스트 공유 설정</p>
          <Icon
            name='XClose'
            size={32}
            className='text-brand-gray-500 rounded-full cursor-pointer hover:bg-brand-gray-100 hover:text-brand-blue-700'
            onClick={onClose}
          />
        </header>
        <div className='flex flex-col min-h-0 flex-1'>
          <QueryBoundary
            subject='공유 옵션 조회'
            loadingFallback={
              <div className='h-full flex flex-col items-center justify-center flex-1 min-h-0'>
                <Loader />
              </div>
            }
          >
            <ShareOptionContent
              id={id}
              resourceType='place_list'
              padding='p-6'
            />
          </QueryBoundary>
        </div>
      </div>
    </div>,
    document.body,
  );
}
