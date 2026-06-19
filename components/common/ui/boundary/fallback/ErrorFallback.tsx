import { FallbackProps } from 'react-error-boundary';

// 커스텀 ErrorFallback 기본 구조
// default는 QueryBoundary에 구현되어 있으므로, 명시적으로 커스텀 ErrorFallback을 적용하지 않으면 defaultErrorFallback이 적용됩니다.
// 커스텀 ErrorFallback은 필요할 때 새로 만들어서 사용하면 됩니다.
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  let errorMessage = '알 수 없는 에러가 발생했습니다.';
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className='w-full flex flex-col gap-2 items-center justify-center py-5'>
      <p className='text-brand-gray-600'>{errorMessage}</p>
      <button
        onClick={resetErrorBoundary}
        className='bg-tag-red-text text-brand-gray-0 py-2 px-4 rounded-sm text-typo-description cursor-pointer'
      >
        다시 시도하기
      </button>
    </div>
  );
}
