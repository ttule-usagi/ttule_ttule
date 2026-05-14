import SignUpWithGoogle from '@/components/features/SignUpWithGoogle';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/utils/auth';

export default async function SignUpGoogle() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <SignUpWithGoogle user={session.user} />;
}
