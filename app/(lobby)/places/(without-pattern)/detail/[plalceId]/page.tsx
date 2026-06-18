export default async function PlaceDetailPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params;

  return (
    <>
      <span>{placeId}상세페이지</span>
    </>
  );
}
