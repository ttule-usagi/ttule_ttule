import { useReducer } from 'react';

export interface AuthState {
  email: string;
  password: string;
  username: string;
  error: string;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_FIELD'; field: keyof AuthState; value: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_LOADING'; loading: boolean };

const reducer = (state: AuthState, action: AuthAction): AuthState => {
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

export const useAuthForm = (initialState: AuthState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: id as keyof AuthState, value });
  };

  return {
    state,
    dispatch,
    handleChange,
  };
};
