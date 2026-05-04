'use client';

import { Icon } from '../common/Icon';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const icons = [
  { name: 'Luggage', href: '/main' },
  { name: 'Bookmark', href: '/places' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='fixed h-full max-w-16 bg-brand-blue-700 flex flex-col justify-center items-center gap-2 p-2'>
      {icons.map((icon) => (
        <Link
          key={icon.name}
          href={icon.href}
        >
          <button
            className={`flex items-center justify-center p-2.5 rounded-lg ${pathname === icon.href ? 'bg-brand-blue-500 text-white' : 'text-brand-blue-300'}`}
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
