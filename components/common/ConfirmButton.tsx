'use client';

interface ConfirmButtonProps {
  text: string;
  onClick?: () => void;
}

export default function ConfirmButton({ text, onClick }: ConfirmButtonProps) {
  return (
    <button
      className='btn-small bg-brand-blue-700 text-brand-gray-0 border'
      onClick={onClick}
    >
      {text}
    </button>
  );
}
