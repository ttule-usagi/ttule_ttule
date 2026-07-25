export default async function PlaceListDetail({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;

  return <div>edit-list</div>;
}
