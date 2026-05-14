import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProfileImage() {
  const { data: session } = useSession();
  return (
    <div className='w-12 h-12 rounded-full bg-brand-blue-100 box-border border border-brand-blue-700'>
      {session?.user?.image && (
        <Image
          src={session.user.image}
          alt='profile image'
          width={48}
          height={48}
          className='w-full h-full rounded-full object-cover'
        />
      )}
    </div>
  );
}
