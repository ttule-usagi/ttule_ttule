'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@/components/common/Icon';

const icons = [
  { name: 'Luggage', href: '/lobby' },
  { name: 'Bookmark', href: '/places' },
];

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <div className='flex flex-col justify-center gap-2 p-2'>
      {icons.map((icon) => (
        <Link
          key={icon.name}
          href={icon.href}
        >
          <button
            className={`flex items-center justify-center p-2.5 rounded-lg cursor-pointer ${pathname.startsWith(icon.href) ? 'bg-brand-blue-500 text-white hover:bg-brand-blue-400' : 'text-brand-blue-300 hover:bg-brand-blue-800/50'}`}
          >
            <Icon
              name={icon.name as 'Luggage' | 'Bookmark'}
              size={28}
            />
          </button>
        </Link>
      ))}
    </div>
  );
}
