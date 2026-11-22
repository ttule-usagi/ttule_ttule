import SearchSection from '@/components/common/SearchSection';
import PlaceSheet from '@/components/layouts/PlaceSheet';
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
    <div className={`h-full w-full md:w-102 flex flex-col md:bg-line-pattern ${paddingTop}`}>
      {session && (
        <div className='absolute top-0 md:left-16 z-20 w-full md:w-102'>
          {/* 배경 전용: 블러는 여기에만 */}
          <div className='absolute inset-0 -z-10 bg-white/30 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none' />
          <SearchSection />
        </div>
      )}

      <PlaceSheet paddingTop={paddingTop}>{children}</PlaceSheet>
    </div>
  );
}
