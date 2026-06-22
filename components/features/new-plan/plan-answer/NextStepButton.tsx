// NextStepButton.tsx
'use client';

import { Icon } from '@/components/common/Icon';

interface Props {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function NextStepButton({ label = '다음단계', onClick, disabled = false }: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className='w-full flex items-center justify-center gap-1 rounded-lg bg-white/90 
      text-brand-blue-600 text-typo-base font-medium py-2.5
      disabled:opacity-40 disabled:cursor-not-allowed'
    >
      {label}
      <Icon
        name='ChevronDown'
        size={16}
      />
    </button>
  );
}
