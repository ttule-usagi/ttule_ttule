import Sidebar from '@/components/layouts/Sidebar';

export default function LobbyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen w-screen flex bg-brand-blue-50'>
      <Sidebar />
      <main className='flex-1'>{children}</main>
    </div>
  );
}
