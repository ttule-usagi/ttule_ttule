'use client';

interface ConfirmButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ConfirmButton({ text, onClick, disabled }: ConfirmButtonProps) {
  return (
    <button
      className='btn-small bg-brand-blue-700 text-brand-gray-0 border'
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
