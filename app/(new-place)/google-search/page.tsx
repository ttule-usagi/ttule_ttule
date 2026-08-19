import { Suspense } from 'react';

import GoogleSearchContent from '@/components/features/new-place/GoogleSearchContent';

export default function GoogleSearchPage() {
  return (
    <Suspense fallback={null}>
      <GoogleSearchContent />
    </Suspense>
  );
}
