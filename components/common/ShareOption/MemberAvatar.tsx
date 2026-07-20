import Image from 'next/image';

interface MemberAvatarProps {
  name: string;
  size?: number;
  profileImage: string | null;
}

export function MemberAvatar({ name, size = 36, profileImage }: MemberAvatarProps) {
  const initial = name.charAt(0);

  return (
    <div
      className='rounded-full bg-brand-blue-100 box-border shrink-0'
      style={{ width: size, height: size }}
    >
      {profileImage ? (
        <Image
          src={profileImage}
          alt={`${name}의 프로필 이미지`}
          width={size}
          height={size}
          className='w-full h-full rounded-full object-cover'
        />
      ) : (
        <div
          className='flex shrink-0 items-center justify-center rounded-full text-typo-base'
          style={{
            width: size,
            height: size,
          }}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
