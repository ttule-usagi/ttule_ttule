import { useReducer } from 'react';

export interface SignupState {
  email: string;
  password: string;
  username: string;
  error: {
    field?: string;
    message: string;
  };
  loading: boolean;
}

type SignupAction =
  | { type: 'SET_FIELD'; field: keyof SignupState; value: string }
  | { type: 'SET_ERROR'; error: { field?: string; message: string } }
  | { type: 'SET_LOADING'; loading: boolean };

const reducer = (state: SignupState, action: SignupAction): SignupState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    default:
      return state;
  }
};

export const useSignupForm = (initialState: SignupState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: id as keyof SignupState, value });
  };

  return {
    state,
    dispatch,
    handleChange,
  };
};
