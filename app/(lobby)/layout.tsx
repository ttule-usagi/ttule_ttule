import Sidebar from '@/components/layouts/sidebar/Sidebar';

export default async function LobbyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen w-full flex bg-brand-gray-50 overflow-hidden overscroll-none'>
      <Sidebar />
      <main className='flex-1 pl-16 overflow-hidden'>{children}</main>
    </div>
  );
}
