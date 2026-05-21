export default async function PlaceListDetail({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  return <div>장소 리스트 {listId}의 상세페이지</div>;
}
