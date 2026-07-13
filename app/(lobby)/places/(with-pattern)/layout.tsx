import CorePlaceSearchInput from '@/components/features/search/CorePlaceSearchInput';
import { auth } from '@/lib/utils/auth';

export default async function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <section className='w-102 pt-5 px-4 pb-7 overflow-y-auto h-screen bg-line-pattern'>
      {session && <CorePlaceSearchInput />}
      {children}
    </section>
  );
}
