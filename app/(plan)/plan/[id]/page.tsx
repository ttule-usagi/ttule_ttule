import InviteEditorHandler from '@/components/features/invite/InviteEditorHandler';
import PlanDetailContainer from '@/components/features/plan/plan-detail/PlanDetailContainer';
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
      <PlanDetailContainer planId={id} />
    </>
  );
}
