import Sidebar from '@/components/layouts/Sidebar';
import { auth } from '@/lib/utils/auth';

export default async function LobbyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className='h-full w-full flex bg-brand-gray-50'>
      {session && <Sidebar />}
      <main className='flex-1'>{children}</main>
    </div>
  );
}
