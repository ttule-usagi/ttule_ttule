import PlaceListEmbedMap from '@/components/features/place-list/map/PlaceListEmbedMap';

export default function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen w-full flex'>
      {children}
      <PlaceListEmbedMap />
    </div>
  );
}
