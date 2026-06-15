import PlaceMap from '@/components/features/Place/PlaceMap';

export default function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen w-full flex'>
      {children}

      {/* 우측 지도 */}
      <section className='flex-1 bg-brand-blue-50 h-full'>{/* <PlaceMap /> */}</section>
    </div>
  );
}
