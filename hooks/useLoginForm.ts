import { useReducer } from 'react';

export interface LoginState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
}

type LoginAction =
  | { type: 'SET_FIELD'; field: keyof LoginState; value: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_LOADING'; loading: boolean };

const reducer = (state: LoginState, action: LoginAction): LoginState => {
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

export const useLoginForm = (initialState: LoginState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: id as keyof LoginState, value });
  };

  return {
    state,
    dispatch,
    handleChange,
  };
};
