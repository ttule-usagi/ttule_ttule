'use client';

import type { PlaceCategory, PlaceSearchResult } from '@/hooks/new-place/useAddNewPlaceForm';
import { mapPrimaryTypeToCategory, useAddNewPlaceForm } from '@/hooks/new-place/useAddNewPlaceForm';
import { useCreatePlace } from '@/hooks/new-place/useCreatePlace';

import { PlacePreviewCard } from './components//PlacePreviewCard';
import { PlaceManualFields } from './components/PlaceManualFields';
import { PlaceSearchInput } from './components/PlaceSearchInput';

export function AddNewPlaceContainer() {
  const { state, dispatch, validate, buildPayload } = useAddNewPlaceForm();
  const { mutate: createPlace, isPending, isSuccess, isError, error, reset: resetMutation } = useCreatePlace();

  function handleSelectPlace(place: PlaceSearchResult) {
    const mappedCategory = mapPrimaryTypeToCategory(place.primary_type);
    dispatch({ type: 'SELECT_PLACE', payload: place, mappedCategory });
    resetMutation();
  }

  function handleSubmit() {
    if (!validate()) return;
    const payload = buildPayload();
    if (!payload) return;

    createPlace(payload, {
      onSuccess: () => {
        dispatch({ type: 'RESET' });
      },
    });
  }

  return (
    <div className='max-w-xl mx-auto px-4 py-10 space-y-8 w-100 bg-brand-gray-50 h-screen'>
      <div>
        <p className='text-xs font-medium text-muted uppercase tracking-widest mb-1'>Admin</p>
        <h1 className='text-xl font-medium text-primary'>장소 등록</h1>
      </div>

      <PlaceSearchInput onSelect={handleSelectPlace} />

      {state.selectedPlace && (
        <>
          <PlacePreviewCard
            place={state.selectedPlace}
            mappedCategory={state.category}
          />

          <div className='border-t border-default pt-6'>
            <PlaceManualFields
              koreanName={state.korean_name}
              originalName={state.original_name}
              category={state.category}
              koreanNameError={state.errors.korean_name}
              onKoreanNameChange={(v) => dispatch({ type: 'SET_KOREAN_NAME', payload: v })}
              onOriginalNameChange={(v) => dispatch({ type: 'SET_ORIGINAL_NAME', payload: v })}
              onCategoryChange={(v: PlaceCategory) => dispatch({ type: 'SET_CATEGORY', payload: v })}
            />
          </div>

          <div className='flex gap-3 pt-2'>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className='flex-1 btn-primary bg-brand-blue-500 p-2 rounded-full text-brand-gray-0 hover:bg-brand-blue-700'
            >
              {isPending ? '등록 중...' : 'DB에 등록'}
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'RESET' });
                resetMutation();
              }}
              className='btn-secondary'
            >
              초기화
            </button>
          </div>

          {isSuccess && <p className='text-sm text-success bg-success rounded-lg px-4 py-3'>등록이 완료됐어요.</p>}
          {isError && (
            <p className='text-sm text-danger bg-danger rounded-lg px-4 py-3'>
              {(error as Error)?.message ?? '등록 중 오류가 발생했어요.'}
            </p>
          )}
        </>
      )}
    </div>
  );
}
