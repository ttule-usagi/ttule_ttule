'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { Icon } from '@/components/common/Icon';

interface PlanViewToggleProps {
  planId: string;
}

export default function PlanViewToggle({ planId }: PlanViewToggleProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOverview = searchParams.get('view') === 'overview';

  return (
    <div className='flex gap-2'>
      {isOverview ? (
        <Link href={pathname}>
          <div className='flex items-center justify-center size-12 rounded-lg bg-neon-green hover:bg-neon-hover shadow-lg p-2'>
            <Icon
              name='LayoutRight'
              size={32}
            />
          </div>
        </Link>
      ) : (
        <Link href={`/plan/${planId}?view=overview`}>
          <div className='flex items-center justify-center size-12 rounded-lg bg-neon-green hover:bg-neon-hover  shadow-lg p-2'>
            <Icon
              name='Columns'
              size={32}
              className='text-brand-gray-700'
            />
          </div>
        </Link>
      )}
    </div>
  );
}
