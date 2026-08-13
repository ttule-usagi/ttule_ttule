import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import EditInfoForm from '@/components/features/user/EditInfoForm';
import { prefetchUserInfo } from '@/lib/actions/api/prefetch/prefetchUserInfo';
import { getQueryClient } from '@/lib/utils/getQueryClient';

export default async function MyPage() {
  const queryClient = getQueryClient();
  await prefetchUserInfo(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryBoundary subject='내 정보'>
        <EditInfoForm />
      </QueryBoundary>
    </HydrationBoundary>
  );
}
