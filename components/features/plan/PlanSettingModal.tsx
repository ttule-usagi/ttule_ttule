import { useState } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '@/components/common/Icon';
import ShareOptionContent from '@/components/common/ShareOption/ShareOptionContent';
import TabButton from '@/components/common/TabButton';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';

import PlanInfoContent from './plan-info/PlanInfoContent';

export default function PlanSettingModal({ id, onClose }: { id: string; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'shareOption'>('info');

  return createPortal(
    <div
      className='modal-overlay'
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className='relative flex flex-col bg-white rounded-lg relative pt-7 px-6 pb-6 min-h-100 h-187 max-h-[80vh] min-w-140'
        onClick={(e) => e.stopPropagation()}
      >
        <header className='flex justify-between items-center shrink-0 mb-4'>
          <p className='text-typo-title font-medium text-brand-blue-800'>계획 설정</p>
          <Icon
            name='XClose'
            size={32}
            className='text-brand-gray-500 cursor-pointer'
            onClick={onClose}
          />
        </header>
        <nav className='flex items-center gap-4 border-b border-brand-gray-100 -mx-6 px-6 mb-6 shrink-0'>
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
          <div className='flex-1 min-h-0 overflow-y-auto pb-11 mb-10'>
            <QueryBoundary>
              <PlanInfoContent id={id} />
            </QueryBoundary>
          </div>
        )}
        {tab === 'shareOption' && (
          <QueryBoundary>
            <ShareOptionContent
              id={id}
              resourceType='plan'
            />
          </QueryBoundary>
        )}
      </div>
    </div>,
    document.body,
  );
}
