import Sidebar from '@/components/layouts/Sidebar';

export default function LobbyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-full w-full flex bg-brand-gray-50'>
      <Sidebar />
      <main className='flex-1 pl-32 pr-16 pb-60'>{children}</main>
    </div>
  );
}
