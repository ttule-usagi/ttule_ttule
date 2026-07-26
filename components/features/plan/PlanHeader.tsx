'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGetPlanDetail } from '@/hooks/plan/useGetPlanDetail';
import { Icon } from '@/components/common/Icon';
import LobbyPlanActionMenu from './lobby/LobbyPlanActionMenu';

interface PlanHeaderProps {
  planId: string;
}

function formatDateRange(departureDate: string | null, arrivalDate: string | null, isDateUndecided: boolean): string {
  if (isDateUndecided || !departureDate || !arrivalDate) return '날짜 미정';
  const fmt = (d: string) => {
    const [, m, day] = d.split('-');
    return `${parseInt(m)}/${parseInt(day)}`;
  };
  return `${fmt(departureDate)}~${fmt(arrivalDate)}`;
}

export default function PlanHeader({ planId }: PlanHeaderProps) {
  const { data } = useGetPlanDetail(planId);
  const { plan, members } = data;

  const dateRange = formatDateRange(plan.departureDate, plan.arrivalDate, plan.isDateUndecided);

  return (
    <div className='absolute top-0 right-0 flex gap-4 items-end p-5 z-10  '>
      {/* 홈/레이아웃 모드 전환 버튼 */}
      <div className='flex gap-3 items-center shrink-0'>
        <Link href='/lobby'>
          <div className='flex items-center justify-center size-12 rounded-lg bg-brand-blue-400 shadow-lg p-2'>
            <Icon
              name='Luggage'
              size={32}
              className='text-white'
            />
          </div>
        </Link>
        <Link href={`/plan/${planId}/edit`}>
          <div className='flex items-center justify-center size-12 rounded-lg bg-neon-green shadow-lg p-2'>
            <Icon
              name='Columns'
              size={32}
              className='text-brand-gray-700'
            />
          </div>
        </Link>
      </div>

      {/* 계획 정보 카드 */}
      <div className='bg-white rounded-lg shadow-lg px-4 py-2 flex items-center justify-between flex-1 max-w-115 min-w-95.5 w-[39vw] '>
        <div className='flex items-center gap-2'>
          {/* 계획 제목 */}
          <p className='text-typo-sub-title text-brand-blue-600 truncate max-w-50'>{plan.title}</p>

          {/* 멤버 프로필 이미지 */}
          <div className='flex items-center'>
            {members.slice(0, 3).map((member, index) => (
              <div
                key={member.userId}
                className='relative size-6 rounded-full overflow-hidden border-2 border-white'
                style={{ marginLeft: index === 0 ? 0 : -8, zIndex: members.length - index }}
              >
                {member.profileImageUrl ? (
                  <Image
                    src={member.profileImageUrl}
                    alt={member.username}
                    fill
                    sizes='24px'
                    className='object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-brand-blue-100 flex items-center justify-center'>
                    <span className='text-[10px] text-brand-blue-700 font-semibold'>{member.username.slice(0, 1)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 날짜 */}
          <p className='text-typo-base text-brand-blue-600 whitespace-nowrap'>{dateRange}</p>
        </div>

        {/* 체크/설정 버튼 */}
        <div className='flex gap-[12px] items-center shrink-0'>
          {/* <button aria-label='체크'>
            <Icon
              name='CheckboxChecked'
              size={32}
              className='text-brand-blue-600'
            />
          </button> */}
          <LobbyPlanActionMenu id={planId} />
        </div>
      </div>
    </div>
  );
}
