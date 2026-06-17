import CorePlaceSearchInput from '@/components/features/search/CorePlaceSearchInput';

export default function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className='w-102 pt-5 px-4 pb-7 overflow-y-auto h-screen bg-line-pattern'>
      <CorePlaceSearchInput />
      {children}
    </section>
  );
}
