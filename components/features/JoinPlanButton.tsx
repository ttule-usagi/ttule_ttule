'use client';

import { useModalStore } from '@/lib/store/modalStore';

interface JoinPlanButtonProps {
  variant: 'primary' | 'secondary';
}

const variantStyle = {
  primary: 'text-typo-title px-9 py-2.5',
  secondary: 'text-typo-base p-3',
};

export default function JoinPlanButton({ variant = 'primary' }: JoinPlanButtonProps) {
  const { open } = useModalStore();

  return (
    <button
      className={`font-normal rounded-lg bg-neon-green text-brand-blue-700 ${variantStyle[variant]} cursor-pointer`}
      onClick={() => open({ type: 'enterInviteLink' })}
    >
      여행 계획에 참여하기
    </button>
  );
}
