import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import LoginButtonProfile from '@/components/common/LoginButtonProfile';
import { prefetchUserInfo } from '@/lib/actions/api/prefetch/prefetchUserInfo';
import { auth } from '@/lib/utils/auth';
import { getQueryClient } from '@/lib/utils/getQueryClient';

import SidebarNav from './SidebarNav';
import SidebarProfile from './SidebarProfile';

export default async function Sidebar() {
  const session = await auth();
  const queryClient = getQueryClient();

  if (session) {
    await prefetchUserInfo(queryClient);
  }

  return (
    <div className='fixed h-full max-w-16 bg-brand-blue-700 flex flex-col justify-center items-center z-999'>
      <SidebarNav />
      <HydrationBoundary state={dehydrate(queryClient)}>
        {session ? <SidebarProfile /> : <LoginButtonProfile />}
      </HydrationBoundary>
    </div>
  );
}
