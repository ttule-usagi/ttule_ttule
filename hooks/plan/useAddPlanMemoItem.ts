// hooks/plan/useAddPlanMemoItem.ts
'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { addPlanMemoItem } from '@/lib/actions/planItem';

interface AddMemoItemParams {
  scheduleId: string;
  placeName: string;
  memoContent?: string | null;
  visitTime?: string | null;
}

export function useAddPlanMemoItem() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMemoItem = async ({ scheduleId, placeName, memoContent, visitTime }: AddMemoItemParams) => {
    if (isSubmitting) return { error: 'SUBMITTING' };
    setIsSubmitting(true);

    const result = await addPlanMemoItem({
      scheduleId,
      placeName,
      memoContent: memoContent ?? null,
      visitTime: visitTime ?? null,
    });

    setIsSubmitting(false);

    if (result.success) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('items') && query.queryKey.includes(scheduleId),
        refetchType: 'active',
      });
    } else {
      console.error('❌ 메모 추가 실패:', result.error.message);
      // TODO: 추후 toast 추가
    }

    return result;
  };

  return { addMemoItem, isSubmitting };
}
