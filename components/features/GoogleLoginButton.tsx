'use client';

interface GoogleSignInButtonProps {
  onClick?: () => void;
}

export default function GoogleSignInButton({ onClick }: GoogleSignInButtonProps) {
  return (
    <button
      onClick={onClick}
      className='w-90 h-12 rounded border'
    >
      Google 계정으로 계속하기
    </button>
  );
}
