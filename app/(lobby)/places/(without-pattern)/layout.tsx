import CorePlaceSearchInput from '@/components/features/search/CorePlaceSearchInput';
import { auth } from '@/lib/utils/auth';
import { getPlacesLayoutPaddingTop } from '@/lib/utils/getPlacesLayoutPaddingTop';

export default async function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const paddingTop = await getPlacesLayoutPaddingTop();

  return (
    <div className={`h-full w-102 flex flex-col bg-brand-gray-0 ${paddingTop}`}>
      {session && (
        <div className='z-20 px-4 pt-5 flex-none'>
          <CorePlaceSearchInput />
        </div>
      )}

      <section className='flex-1 min-h-0 overflow-hidden'>{children}</section>
    </div>
  );
}
