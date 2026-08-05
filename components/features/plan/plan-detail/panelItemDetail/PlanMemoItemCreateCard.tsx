'use client';

import { useState } from 'react';

import NotchRows from './NotchRows';
import PlanMemoItemForm from './PlanMemoItemForm';

interface PlanMemoItemCreateCardProps {
  onClose: () => void;
  onSave: (created: { placeName: string; visitTime: string | null; memoContent: string | null }) => void;
  isSaving?: boolean;
}

export default function PlanMemoItemCreateCard({ onClose, onSave, isSaving }: PlanMemoItemCreateCardProps) {
  const [placeName, setPlaceName] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [memoContent, setMemoContent] = useState('');

  const handleSave = () => {
    if (!placeName.trim()) return;
    onSave({ placeName, visitTime: visitTime || null, memoContent: memoContent || null });
  };

  return (
    <div className='relative bg-white shadow-sm w-full'>
      <NotchRows count={1} />
      <div className='pl-13 pr-12 py-4 flex flex-col gap-2'>
        <PlanMemoItemForm
          placeName={placeName}
          visitTime={visitTime}
          memoContent={memoContent}
          onPlaceNameChange={setPlaceName}
          onVisitTimeChange={setVisitTime}
          onMemoContentChange={setMemoContent}
        />

        {/* 취소/추가하기 버튼 */}
        <div className='flex gap-2'>
          <button
            onClick={onClose}
            className='flex-1 flex items-center justify-center py-2 border border-brand-gray-200 rounded-1'
          >
            <span className='text-typo-description text-brand-gray-500'>취소</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!placeName.trim() || isSaving}
            className='flex-1 flex items-center justify-center py-2 bg-brand-blue-700 rounded-sm text-brand-gray-50'
          >
            <span>{isSaving ? '추가 중...' : '추가하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
