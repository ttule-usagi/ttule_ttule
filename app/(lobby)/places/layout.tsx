import PlaceMap from '@/components/features/Place/PlaceMap';
import CorePlaceSearchInput from '@/components/features/search/CorePlaceSearchInput';

export default function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen w-full flex'>
      {/* 좌측 컨텐츠 */}
      <section className='w-102 pt-5 px-4 pb-60 overflow-y-auto h-screen bg-line-pattern'>
        <CorePlaceSearchInput />
        {children}
      </section>

      {/* 우측 지도 */}
      <section className='flex-1 bg-brand-blue-50 h-full'>{/* <PlaceMap /> */}</section>
    </div>
  );
}
