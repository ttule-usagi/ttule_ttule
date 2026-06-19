'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

interface QueryBoundaryProps {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: (props: FallbackProps) => React.ReactNode;
}

export function QueryBoundary({ children, loadingFallback = <div>로딩중...</div>, errorFallback }: QueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={errorFallback ?? defaultErrorFallback}
        >
          <Suspense fallback={loadingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function defaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
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
