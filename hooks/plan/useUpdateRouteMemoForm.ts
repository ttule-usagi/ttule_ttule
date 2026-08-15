import { useReducer, useState } from 'react';

import { PlanTransitMode } from '@/types/plan';

import { useUpdateRouteMemo } from './useUpdateRouteMemo';

interface UpdateTransitState {
  transitMode: PlanTransitMode;
  transitDistance: number | null;
  transitTime: number | null;
  transitMemo: string | null;
  isPending: boolean;
  submitError: string | null;
}

type UpdateTransitAction =
  | { type: 'SET_TRANSIT_MODE'; value: PlanTransitMode }
  | { type: 'SET_TRANSIT_DISTANCE'; value: number | null }
  | { type: 'SET_TRANSIT_TIME'; value: number | null }
  | { type: 'SET_TRANSIT_MEMO'; value: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET' };

const initialState: UpdateTransitState = {
  transitMode: 'transit',
  transitDistance: null,
  transitTime: null,
  transitMemo: '',
  isPending: false,
  submitError: null,
};

function reducer(state: UpdateTransitState, action: UpdateTransitAction): UpdateTransitState {
  switch (action.type) {
    case 'SET_TRANSIT_MODE':
      return { ...state, transitMode: action.value };
    case 'SET_TRANSIT_DISTANCE':
      return { ...state, transitDistance: action.value };
    case 'SET_TRANSIT_TIME':
      return { ...state, transitTime: action.value };

    case 'SET_TRANSIT_MEMO':
      return { ...state, transitMemo: action.value };
    case 'SUBMIT_START':
      return { ...state, isPending: true, submitError: null };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isPending: false,
      };
    case 'SUBMIT_ERROR':
      return { ...state, isPending: false, submitError: action.error };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const validate = (state: UpdateTransitState): string | null => {
  if (!state.transitMode) {
    return '이동수단을 선택해주세요.';
  }

  return null;
};

export function useUpdateRouteMemoForm(
  planId: string,
  scheduleId: string,
  placeId: string,
  initial?: Partial<UpdateTransitState>,
) {
  const [state, dispatch] = useReducer(reducer, initial, (init) => ({ ...initialState, ...init }));
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate, isPending, error: mutationError } = useUpdateRouteMemo({ planId, scheduleId });

  const submitToServer = () => {
    dispatch({ type: 'SUBMIT_START' });

    mutate(
      {
        placeId,
        transitMode: state.transitMode,
        transitDistance: state.transitDistance,
        transitTime: state.transitTime,
        transitMemo: state.transitMemo,
      },
      {
        onSuccess: (result) => {
          if (result.success) dispatch({ type: 'SUBMIT_SUCCESS' });
          else dispatch({ type: 'SUBMIT_ERROR', error: '수정에 실패했습니다.' });
        },
        onError: () => dispatch({ type: 'SUBMIT_ERROR', error: '수정 중 오류가 발생했습니다.' }),
      },
    );
  };

  const handleSubmit = () => {
    const error = validate(state);
    if (error) {
      setValidationError(error);
      dispatch({ type: 'SUBMIT_ERROR', error });
      return;
    }
    setValidationError(null);

    submitToServer();
  };

  return { state, dispatch, handleSubmit, isPending, error: validationError ?? mutationError?.message ?? null };
}
