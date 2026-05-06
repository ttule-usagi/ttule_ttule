'use client';

import ReactQueryConfigContext from '@/components/features/provider/ReactQueryConfigContext';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReactQueryConfigContext>{children}</ReactQueryConfigContext>
    </SessionProvider>
  );
}
