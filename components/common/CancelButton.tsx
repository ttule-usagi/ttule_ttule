'use client';

interface CancelButtonProps {
  text: string;
  onClick?: () => void;
}

export default function CancelButton({ text, onClick }: CancelButtonProps) {
  return (
    <button
      className='btn-small bg-brand-gray-50 text-brand-gray-400 border border-brand-gray-200'
      onClick={onClick}
    >
      {text}
    </button>
  );
}
