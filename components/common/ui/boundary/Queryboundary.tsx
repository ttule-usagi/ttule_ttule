'use client';

import { getErrorMessage, RpcError, RpcErrorMessage } from '@/types/errors';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

interface QueryBoundaryProps {
  children: React.ReactNode;
  errorFallback?: (props: FallbackProps) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  subject?: string;
}

export function QueryBoundary({ children, errorFallback, loadingFallback, subject }: QueryBoundaryProps) {
  const fallbackRender = errorFallback ?? ((props: FallbackProps) => defaultErrorFallback(props, subject ?? '대상'));
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={fallbackRender}
        >
          <Suspense fallback={loadingFallback ?? null}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function defaultErrorFallback({ error, resetErrorBoundary }: FallbackProps, subject: string) {
  let errorMessage = '알 수 없는 에러가 발생했습니다.';

  if (error instanceof RpcError) {
    errorMessage = getErrorMessage(error.message as RpcErrorMessage, { subject, action: '조회' });
  } else if (error instanceof Error) {
    // TODO: 추후 삭제 필요 - 아직 수정 안 한 쿼리들을 위해 남겨둠
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
