import { auth } from '@/lib/utils/auth';
import SidebarNav from './SidebarNav';
import SidebarProfile from './SidebarProfile';
import LoginButtonProfile from '@/components/common/LoginButtonProfile';

export default async function Sidebar() {
  const session = await auth();

  return (
    <div className='fixed h-full max-w-16 bg-brand-blue-700 flex flex-col justify-center items-center z-999'>
      <SidebarNav />
      {session && <SidebarProfile />}
      {!session && <LoginButtonProfile />}
    </div>
  );
}
