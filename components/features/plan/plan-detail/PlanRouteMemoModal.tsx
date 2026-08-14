import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '@/components/common/Icon';
import { scheduleItemsQueryOptions } from '@/hooks/plan/useGetScheduleItems';
import { useUpdateRouteMemoForm } from '@/hooks/plan/useUpdateRouteMemoForm';
import { checkIsKorean } from '@/hooks/useNewPlaceForm';
import { buildGoogleMapsDirectionsUrl } from '@/lib/utils/getGoogleMapsDirectionUrl';
import { getRouteDistance } from '@/lib/utils/googleRoutes';
import { formatDuration } from '@/lib/utils/minutes';
import { TRANSFORT_EMOJI } from '@/lib/utils/transport';
import { PlanTransitMode, TRANSIT_MODE_LABELS, type PlanItem } from '@/types/plan';

import ModalHeader from '../../place/save/modal-item/ModalHeader';

interface PlanRouteMemoModalProps {
  planId: string;
  item: PlanItem;
  onClose: () => void;
}

const TRANSIT_MODES = Object.keys(TRANSIT_MODE_LABELS) as PlanTransitMode[];

export default function PlanRouteMemoModal({ planId, item, onClose }: PlanRouteMemoModalProps) {
  const queryClient = useQueryClient();
  const items = queryClient.getQueryData<PlanItem[]>(scheduleItemsQueryOptions(planId, item.scheduleId).queryKey) ?? [];

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const currentItem = items[currentIndex];
  // memo 아이템은 좌표가 없으니 건너뛰고, 다음 place 타입 아이템을 도착지로 삼음
  const nextItem = items.slice(currentIndex + 1).find((i) => i.type === 'place');

  const { state, dispatch, handleSubmit, isPending, error } = useUpdateRouteMemoForm(planId, item.scheduleId, item.id, {
    transitMode: currentItem?.transitMode ?? 'transit',
    transitDistance: currentItem?.transitDistance ?? null,
    transitTime: currentItem?.transitTime ?? null,
    transitMemo: currentItem?.transitMemo ?? null,
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const isKorea = item.latitude != null && item.longitude != null && checkIsKorean(item.latitude, item.longitude);

  const handleChangeTransitMode = async (mode: PlanTransitMode) => {
    dispatch({ type: 'SET_TRANSIT_MODE', value: mode });

    if (
      !currentItem ||
      !nextItem ||
      currentItem.latitude == null ||
      currentItem.longitude == null ||
      nextItem.latitude == null ||
      nextItem.longitude == null
    ) {
      return;
    }

    setIsCalculating(true);
    try {
      const route = await getRouteDistance(
        { lat: currentItem.latitude, lng: currentItem.longitude, googlePlaceId: currentItem.googlePlaceId },
        { lat: nextItem.latitude, lng: nextItem.longitude, googlePlaceId: nextItem.googlePlaceId },
        mode,
      );

      dispatch({ type: 'SET_TRANSIT_DISTANCE', value: route ? route.distanceMeters / 1000 : null });
      dispatch({ type: 'SET_TRANSIT_TIME', value: route ? route.durationMinutes : null });
    } finally {
      setIsCalculating(false);
    }
  };

  if (!currentItem) return null; // 캐시에 없는 예외 상황 방어

  const emoji = TRANSFORT_EMOJI[state.transitMode] ?? '📍';

  const handleGoogleRouteURL = () => {
    if (
      !nextItem ||
      currentItem.latitude == null ||
      currentItem.longitude == null ||
      nextItem.latitude == null ||
      nextItem.longitude == null
    )
      return;
    const url = buildGoogleMapsDirectionsUrl(
      {
        lat: currentItem.latitude,
        lng: currentItem.longitude,
        googlePlaceId: currentItem.googlePlaceId,
        name: currentItem.placeName,
      },
      {
        lat: nextItem.latitude,
        lng: nextItem.longitude,
        googlePlaceId: nextItem.googlePlaceId,
        name: nextItem.placeName,
      },
      state.transitMode,
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return createPortal(
    <>
      <div
        className='modal-overlay'
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div
          className='relative flex flex-col bg-white rounded-lg relative pt-7 px-6 pb-6 min-h-125 max-w-90'
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader
            title='이동 정보 관리'
            onClose={onClose}
          />

          {/* content */}
          <div className='flex flex-col gap-4 max-h-100 overflow-y-auto mt-4'>
            <div className='flex flex-col gap-2'>
              <p className='text-typo-description text-brand-gray-700'>예상 이동 시간</p>
              <div className='flex justify-between items-center bg-brand-blue-50 px-3 py-2 rounded-lg text-brand-gray-600'>
                <div className='flex flex-row gap-2 '>
                  <span className='font-mona12 text-emoji-sm pl-0.5 pb-0.5'>{emoji}</span>
                  <span>{TRANSIT_MODE_LABELS[state.transitMode]}</span>
                </div>
                <span>
                  {isCalculating
                    ? '계산 중...'
                    : state.transitTime != null
                      ? formatDuration(state.transitTime)
                      : '경로 없음'}
                </span>
              </div>
              {nextItem && (
                <button
                  className='flex flex-row justify-center gap-1.5 items-center text-typo-description text-medium text-brand-gray-600 py-3 border rounded-sm border-brand-gray-200 hover:bg-gray-100 cursor-pointer'
                  onClick={handleGoogleRouteURL}
                >
                  <Icon
                    name='Google'
                    size={15}
                    className='text-brand-gray-500 cursor-pointer'
                  />
                  구글에서 이동경로 확인하기
                </button>
              )}
            </div>

            {/* 이동수단 변경 */}
            <div className='flex flex-col gap-2'>
              <p className='text-typo-description text-brand-gray-700'>이동수단 변경</p>
              <div>
                <div className='flex gap-2 flex-wrap w-full py-2 bg-brand-gray-50 mb-2 justify-center'>
                  {TRANSIT_MODES.map((mode) => {
                    const isDisabled = isKorea && mode !== 'transit';
                    return (
                      <button
                        key={mode}
                        type='button'
                        onClick={() => handleChangeTransitMode(mode)}
                        disabled={isCalculating || isDisabled}
                        className={`flex items-center justify-center px-3 py-1.5 rounded-sm border text-typo-description whitespace-nowrap ${
                          state.transitMode === mode
                            ? 'bg-brand-blue-50 border-brand-blue-200 text-brand-blue-500'
                            : isDisabled
                              ? 'bg-brand-gray-200 border-brand-gray-200 text-brand-gray-500 cursor-not-allowed'
                              : 'bg-white border-brand-gray-300 text-brand-gray-500'
                        }`}
                      >
                        {state.transitMode === mode && (
                          <Icon
                            name='Check'
                            size={18}
                            className='mr-1 text-brand-blue-500 shrink-0'
                          />
                        )}
                        {TRANSIT_MODE_LABELS[mode]}
                      </button>
                    );
                  })}
                </div>
                <p className='text-typo-caption text-brand-gray-600 textwrap'>
                  *한국에서는 대중교통 경로만 제공되며, 출발지와 목적지에 따라 경로가 제공되지 않을 수 있습니다.
                </p>
              </div>
            </div>
            {/* 구분선 */}
            <hr className='border-brand-gray-200' />

            {/* 이동 메모 */}
            <div className='flex flex-col gap-2'>
              <p className='text-typo-description text-brand-gray-700'>이동 메모</p>
              <div className='bg-brand-gray-100 border border-brand-gray-200 rounded-sm px-3 py-2 min-h-18 max-h-30'>
                <textarea
                  value={state.transitMemo ?? ''}
                  onChange={(e) => dispatch({ type: 'SET_TRANSIT_MEMO', value: e.target.value })}
                  placeholder='메모를 입력하세요'
                  maxLength={100}
                  className='bg-transparent text-typo-description text-brand-gray-600 w-full outline-none field-sizing-content resize-none placeholder:text-brand-gray-400 min-h-14'
                />
              </div>
            </div>
          </div>

          {/* 추가하기 버튼 */}
          {error && (
            <span
              role='alert'
              className='text-red-500 text-typo-description text-right'
            >
              {error}
            </span>
          )}
          <div className='flex flex-row gap-2 mt-4'>
            <button
              onClick={onClose}
              className={
                'flex-1 rounded-sm text-center text-brand-gray-500 border text-typo-base-bold border-brand-gray-200 cursor-pointer '
              }
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || isCalculating}
              className={`w-full py-2 rounded-sm flex-3 text-typo-base-bold text-center transition-colors box-border border cursor-pointer hover:bg-brand-blue-800 ${
                !isPending && !isCalculating
                  ? 'bg-brand-blue-700 text-white border-brand-gray-300'
                  : 'bg-brand-gray-200 text-brand-gray-400 border-brand-gray-200 cursor-not-allowed'
              }`}
            >
              {isPending ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
