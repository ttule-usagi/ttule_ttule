import { useModalStore } from '@/lib/store/modalStore';

import { useEditMyInfo } from './useEditMyInfo';

interface ConfirmGoogleSignupProps {
  email: string;
  username: string;
  newProfileImage: File | null;
  currentProfileImage: string | null;
}

export const useConfirmGoogleSignup = () => {
  const { open } = useModalStore();
  const { mutate: editMyInfo, isPending, fieldError, setFieldError } = useEditMyInfo();

  const confirmGoogleSignup = ({
    email,
    username,
    newProfileImage,
    currentProfileImage,
    onSuccess,
  }: ConfirmGoogleSignupProps & { onSuccess?: () => void }) => {
    open({
      type: 'confirmAction',
      props: {
        description: `다음 정보로 가입할까요?\n\n구글 이메일: ${email}\n뚤레 닉네임: ${username}`,
        confirmButtonText: '가입하기',
        onConfirm: async () => {
          await editMyInfo({ username, newProfileImage, currentProfileImage }, { onSuccess });
          // TODO: 성공 토스트 알림 등 추가
          // toast.success('회원가입 성공!')
        },
      },
    });
  };

  return { confirmGoogleSignup, isPending, fieldError, setFieldError };
};
