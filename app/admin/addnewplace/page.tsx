import { redirect } from 'next/navigation';

import { AddNewPlaceContainer } from '@/components/features/admin/add-new-place/AddNewPlaceContainer';
import { auth } from '@/lib/utils/auth';

export default async function AddNewPlacePage() {
  const session = await auth();

  if (!session?.user?.isSuperAdmin) {
    redirect('/');
  }

  return <AddNewPlaceContainer />;
}
