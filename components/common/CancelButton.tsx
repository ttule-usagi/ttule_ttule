'use client';

interface CancelButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function CancelButton({ text, onClick, disabled }: CancelButtonProps) {
  return (
    <button
      className='btn-small bg-brand-gray-50 text-brand-gray-400 border border-brand-gray-200'
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
