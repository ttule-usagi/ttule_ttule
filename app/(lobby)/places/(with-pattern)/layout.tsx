import { getPlacesLayoutPaddingTop } from '@/lib/utils/getPlacesLayoutPaddingTop';

export default async function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paddingTop = await getPlacesLayoutPaddingTop();
  return <section className={`${paddingTop} px-4 pb-7 bg-line-pattern min-h-full`}>{children}</section>;
}
