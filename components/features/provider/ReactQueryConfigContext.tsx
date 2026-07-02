'use client';
import { getQueryClient } from '@/lib/utils/getQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
type Props = {
  children: React.ReactNode;
};

export default function ReactQueryConfigContext({ children }: Props) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
