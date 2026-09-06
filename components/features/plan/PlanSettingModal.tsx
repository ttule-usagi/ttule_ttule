import { useState } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '@/components/common/Icon';
import Loader from '@/components/common/Loader';
import ShareOptionContent from '@/components/common/ShareOption/ShareOptionContent';
import TabButton from '@/components/common/TabButton';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import { useModalControl } from '@/hooks/useModalControl';

import PlanInfoContent from './plan-info/PlanInfoContent';

export default function PlanSettingModal({ id, onClose }: { id: string; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'shareOption'>('info');
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
        className='relative flex flex-col bg-white rounded-lg min-h-100 h-187 max-h-[80vh] min-w-126 overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='flex justify-between items-center shrink-0 mb-4 pt-7 px-6'>
          <p className='text-typo-title font-medium text-brand-blue-800'>계획 설정</p>
          <Icon
            name='XClose'
            size={32}
            className='text-brand-gray-500 rounded-full cursor-pointer hover:bg-brand-gray-100 hover:text-brand-blue-700'
            onClick={onClose}
          />
        </header>
        <nav className='flex items-center gap-4 border-b border-brand-gray-100 px-6 shrink-0'>
          <TabButton
            buttonText='계획 정보'
            onSetTab={() => setTab('info')}
            activated={tab === 'info'}
          />
          <TabButton
            buttonText='공유 옵션'
            onSetTab={() => setTab('shareOption')}
            activated={tab === 'shareOption'}
          />
        </nav>
        {tab === 'info' && (
          <div className='flex flex-col min-h-0 flex-1'>
            <QueryBoundary
              loadingFallback={
                <div className='h-full flex flex-col items-center justify-center flex-1 min-h-0'>
                  <Loader />
                </div>
              }
            >
              <div className='flex-1 min-h-0 overflow-y-auto pb-17 mb-10 pt-6 px-6'>
                <PlanInfoContent id={id} />
              </div>
            </QueryBoundary>
          </div>
        )}
        {tab === 'shareOption' && (
          <div className='flex flex-col min-h-0 flex-1'>
            <QueryBoundary
              loadingFallback={
                <div className='h-full flex flex-col items-center justify-center flex-1 min-h-0'>
                  <Loader />
                </div>
              }
            >
              <ShareOptionContent
                id={id}
                resourceType='plan'
                padding='p-6'
              />
            </QueryBoundary>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
