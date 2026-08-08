'use client';

import { useEffect } from 'react';

import { usePlanClipboardStore } from '@/lib/store/planClipboardStore';

export default function PlanClipboardCleanup() {
  useEffect(() => {
    return () => usePlanClipboardStore.getState().clear();
  }, []);

  return null;
}
