'use client';

import { useReducer, useRef, useState } from 'react';

import { useModalStore } from '@/lib/store/modalStore';

import { useUpdatePlanInfo } from './useUpdatePlanInfo';

export type ScheduleMode = 'date' | 'undecided';

interface UpdatePlanInfoState {
  destination: string;
  scheduleMode: ScheduleMode;
  startDate: string;
  endDate: string;
  totalDays: number;
  planName: string;
  isPending: boolean;
  submitError: string | null;
}

type UpdatePlanInfoAction =
  | { type: 'SET_DESTINATION'; value: string }
  | { type: 'SET_SCHEDULE_MODE'; value: ScheduleMode }
  | { type: 'SET_START_DATE'; value: string }
  | { type: 'SET_END_DATE'; value: string }
  | { type: 'SET_TOTAL_DAYS'; value: number }
  | { type: 'SET_PLAN_NAME'; value: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET' };

const initialState: UpdatePlanInfoState = {
  destination: '',
  scheduleMode: 'date',
  startDate: '',
  endDate: '',
  totalDays: 1,
  planName: '',
  isPending: false,
  submitError: null,
};

function reducer(state: UpdatePlanInfoState, action: UpdatePlanInfoAction): UpdatePlanInfoState {
  switch (action.type) {
    case 'SET_DESTINATION':
      return { ...state, destination: action.value };
    case 'SET_SCHEDULE_MODE':
      return { ...state, scheduleMode: action.value };
    case 'SET_START_DATE':
      return { ...state, startDate: action.value };
    case 'SET_END_DATE':
      return { ...state, endDate: action.value };
    case 'SET_TOTAL_DAYS':
      return { ...state, totalDays: action.value };
    case 'SET_PLAN_NAME':
      return { ...state, planName: action.value };
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

const validate = (state: UpdatePlanInfoState): string | null => {
  const start = new Date(state.endDate);
  const end = new Date(state.startDate);

  if (!state.planName) {
    return '계획 이름을 입력해주세요.';
  }
  if (!state.destination) {
    return '목적지를 선택해주세요.';
  }

  if (state.scheduleMode === 'date') {
    if (!state.endDate || !state.startDate) {
      return '출발 혹은 도착 날짜를 지정해주세요';
    }
  }

  if (start < end) {
    return '도착일자는 시작일자보다 앞설 수 없습니다.';
  }

  return null;
};

export function useUpdatePlanInfoForm(planId: string, initial?: Partial<UpdatePlanInfoState>) {
  const [state, dispatch] = useReducer(reducer, initial, (init) => ({ ...initialState, ...init }));
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate, isPending, error: mutationError } = useUpdatePlanInfo();
  const { open } = useModalStore();

  // 수정 전 원래 총 일수 — 폼을 만져도 바뀌지 않도록 최초 1회만 고정
  const originalTotalDaysRef = useRef(initial?.totalDays ?? 1);

  const calculateNewTotalDays = (): number => {
    if (state.scheduleMode === 'undecided') {
      return Math.max(1, state.totalDays);
    }
    const start = new Date(state.startDate);
    const end = new Date(state.endDate);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const submitToServer = () => {
    dispatch({ type: 'SUBMIT_START' });
    const [, city] = state.destination.split(':');
    mutate(
      {
        planId,
        title: state.planName,
        destination: city,
        departureDate: state.scheduleMode === 'date' ? state.startDate : null,
        arrivalDate: state.scheduleMode === 'date' ? state.endDate : null,
        isDateUndecided: state.scheduleMode === 'undecided',
        totalDays: state.totalDays,
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

    const newTotalDays = calculateNewTotalDays();

    if (newTotalDays < originalTotalDaysRef.current) {
      open({
        type: 'confirmAction',
        props: {
          description: `여행 기간이 줄어들면 \n 초과되는 일차의 일정이 모두 삭제돼요.\n계속하시겠어요?`,
          confirmButtonText: '계속하기',
          onConfirm: submitToServer,
        },
      });
      return;
    }

    submitToServer();
  };

  return { state, dispatch, handleSubmit, isPending, error: validationError ?? mutationError?.message ?? null };
}
