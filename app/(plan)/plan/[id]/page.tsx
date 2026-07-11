import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import { Suspense } from 'react';

export default async function PlanDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <Suspense fallback={null}>
        <InviteEditorHandler
          id={id}
          resourceType='plan'
        />
      </Suspense>
      <span>계획 디테일</span>
    </>
  );
}
