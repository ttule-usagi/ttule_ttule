import Image from 'next/image';

import { useGetUserInfo } from '@/hooks/user/useGetUserInfo';

export default function ProfileImage() {
  const { data: user } = useGetUserInfo();
  return (
    <div className='w-12 h-12 rounded-full bg-brand-blue-100 box-border border border-brand-blue-700'>
      {user.profileImageUrl && (
        <Image
          src={user.profileImageUrl}
          alt='profile image'
          width={48}
          height={48}
          className='w-full h-full rounded-full object-cover'
        />
      )}
    </div>
  );
}
