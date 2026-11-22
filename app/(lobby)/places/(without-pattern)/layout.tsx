import SearchSection from '@/components/common/SearchSection';
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
    <div className={`h-full w-full md:w-102 flex flex-col bg-brand-gray-0 z-20 ${paddingTop}`}>
      {session && (
        <div className='flex-none z-20'>
          <SearchSection />
        </div>
      )}

      <section className='pt-4 md:pt-0 flex-1 min-h-0 overflow-hidden'>{children}</section>
    </div>
  );
}
