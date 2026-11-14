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
    <div className={`h-full w-102 flex flex-col bg-line-pattern ${paddingTop}`}>
      {session && <SearchSection />}

      <section className='flex-1 min-h-0 overflow-hidden'>{children}</section>
    </div>
  );
}
