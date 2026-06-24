// hooks/useNewPlanForm.ts

import { useReducer } from 'react';

type ScheduleMode = 'date' | 'undecided';

interface NewPlanState {
  step: number;
  destination: string;
  scheduleMode: ScheduleMode;
  startDate: string;
  endDate: string;
  totalDays: number;
  planName: string;
  planId: string | null;
  inviteToken: string | null;
  isPending: boolean;
  submitError: string | null;
}

type NewPlanAction =
  | { type: 'SET_DESTINATION'; value: string }
  | { type: 'SET_SCHEDULE_MODE'; value: ScheduleMode }
  | { type: 'SET_START_DATE'; value: string }
  | { type: 'SET_END_DATE'; value: string }
  | { type: 'SET_TOTAL_DAYS'; value: number }
  | { type: 'SET_PLAN_NAME'; value: string }
  | { type: 'NEXT_STEP' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; planId: string; inviteToken: string }
  | { type: 'SUBMIT_ERROR'; error: string };

const initialState: NewPlanState = {
  step: 1,
  destination: '',
  scheduleMode: 'date',
  startDate: '',
  endDate: '',
  totalDays: 1,
  planName: '',
  planId: null,
  inviteToken: null,
  isPending: false,
  submitError: null,
};

function reducer(state: NewPlanState, action: NewPlanAction): NewPlanState {
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
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'SUBMIT_START':
      return { ...state, isPending: true, submitError: null };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isPending: false,
        planId: action.planId,
        inviteToken: action.inviteToken,
        step: state.step + 1,
      };
    case 'SUBMIT_ERROR':
      return { ...state, isPending: false, submitError: action.error };
    default:
      return state;
  }
}

export function useNewPlanForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
