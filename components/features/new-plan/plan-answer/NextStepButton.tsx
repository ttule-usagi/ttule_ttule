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
      className={`
        w-full flex items-center justify-center gap-1 rounded-lg 
         text-typo-description  py-2 cursor-pointer
     disabled:outline-1 disabled:cursor-not-allowed hover:bg-brand-blue-50
      ${disabled ? ' text-brand-blue-700' : 'text-brand-gray-600 bg-brand-gray-0 '}`}
    >
      {label}
      <Icon
        name='ChevronDown'
        size={24}
      />
    </button>
  );
}
