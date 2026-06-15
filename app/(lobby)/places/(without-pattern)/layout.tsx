import CorePlaceSearchInput from '@/components/features/search/CorePlaceSearchInput';

export default function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className='w-102 pt-5 px-4 pb-60 overflow-y-auto h-screen bg-brand-gray-0'>
      <CorePlaceSearchInput />
      {children}
    </section>
  );
}
