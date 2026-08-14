import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signIn } from 'next-auth/react';

import { signUpAction } from '@/lib/actions/auth';
import { getProfileImageUrl } from '@/lib/actions/getProfileImageUrl';
import { useModalStore } from '@/lib/store/modalStore';
import { getEmailErrorMessage, getPasswordErrorMessage, getUsernameErrorMessage } from '@/lib/utils/validate';
import { getErrorMessage } from '@/types/errors';

import { useSignupForm } from './useSignupForm';

const initialState = {
  email: '',
  password: '',
  username: '',
  image: null,
  error: { field: '', message: '' },
  loading: false,
};

export const useConfirmEmailSignup = () => {
  const { open } = useModalStore();
  const { state, dispatch, handleChange, handleImageChange } = useSignupForm(initialState);

  const handleSubmit = async () => {
    dispatch({ type: 'SET_ERROR', error: { field: '', message: '' } });
    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      let finalImageUrl = '';

      if (state.image) {
        try {
          finalImageUrl = await getProfileImageUrl(state.image);
        } catch (uploadError) {
          console.error('❌ 이미지 업로드 실패:', uploadError);
          dispatch({
            type: 'SET_ERROR',
            error: { field: 'image', message: '이미지 파일을 다시 확인해주세요.' },
          });
          return; // 회원가입 자체를 진행하지 않고 여기서 종료
        }
      }

      const result = await signUpAction({
        email: state.email,
        password: state.password,
        username: state.username,
        profileImageUrl: finalImageUrl,
      });

      if (!result.success) {
        dispatch({
          type: 'SET_ERROR',
          error: {
            field: result.error.field ?? '',
            message: result.error.detail ?? getErrorMessage(result.error.message, { subject: '회원', action: '가입' }),
          },
        });
        return false;
      }

      return true;
    } catch (error) {
      // 리다이렉트 신호는 그대로 다시 던져서 Next.js가 정상 처리하도록 둠
      if (isRedirectError(error)) {
        throw error;
      }

      console.error('❌ 회원가입 처리 중 오류:', error);
      dispatch({
        type: 'SET_ERROR',
        error: { field: '', message: '처리 중 오류가 발생했습니다. 다시 시도해주세요.' },
      });

      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const confirmEmailSignup = () => {
    // 확인 모달 띄우기 전(제출 전) 유효성 검사
    const emailError = getEmailErrorMessage(state.email);
    if (emailError) {
      dispatch({ type: 'SET_ERROR', error: { field: 'email', message: emailError } });
      return;
    }

    const passwordError = getPasswordErrorMessage(state.password);
    if (passwordError) {
      dispatch({ type: 'SET_ERROR', error: { field: 'password', message: passwordError } });
      return;
    }

    const usernameError = getUsernameErrorMessage(state.username);
    if (usernameError) {
      dispatch({ type: 'SET_ERROR', error: { field: 'username', message: usernameError } });
      return;
    }

    open({
      type: 'confirmAction',
      props: {
        description: `다음 정보로 가입할까요?\n\n이메일: ${state.email}\n뚤레 닉네임: ${state.username}`,
        confirmButtonText: '가입하기',
        onConfirm: async () => {
          const isSuccess = await handleSubmit();

          // TODO: 성공 토스트 알림 등 추가
          // toast.success('회원가입 성공!')

          // 가입 성공 시 자동 로그인 처리
          if (isSuccess) {
            await signIn('credentials', { email: state.email, password: state.password, redirectTo: '/lobby' });
          }
        },
      },
    });
  };

  return { confirmEmailSignup, state, handleChange, handleImageChange };
};
