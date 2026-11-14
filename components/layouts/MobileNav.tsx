'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@/components/common/Icon';

const icons = [
  { name: 'Luggage', href: '/lobby' },
  { name: 'Bookmark', href: '/places' },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <div className='absolute md:hidden bottom-5 left-1/2 -translate-x-1/2 px-1 rounded-full bg-brand-blue-500 drop-shadow-lg z-999'>
      <div className='flex flex-row justify-center gap-2 px-2 py-0.5'>
        {icons.map((icon) => (
          <Link
            key={icon.name}
            href={icon.href}
          >
            <button
              className={`flex items-center justify-center p-2.5 rounded-lg cursor-pointer ${pathname.startsWith(icon.href) ? ' text-white ' : 'text-brand-blue-300'}`}
            >
              <Icon
                name={icon.name as 'Luggage' | 'Bookmark'}
                size={28}
              />
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
