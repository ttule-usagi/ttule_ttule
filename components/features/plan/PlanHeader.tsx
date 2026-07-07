'use client';

import Image from 'next/image';
import Link from 'next/link'
import { useGetPlanDetail } from '@/hooks/plan/useGetPlanDetail';
import { Icon } from '@/components/common/Icon';

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
    <div className='absolute top-0 right-0 flex gap-[16px] items-end px-[20px] py-[20px] z-10  '>
      {/* 홈/레이아웃 모드 전환 버튼 */}
      <div className='flex gap-[12px] items-center shrink-0'>
        <Link href='/lobby'>
        <div
          className='flex items-center justify-center size-[48px] rounded-[8px] bg-brand-blue-400 shadow-lg p-[8px]'
         
        >
          <Icon
            name='Luggage'
            size={32}
            className='text-white'
          />
        </div>
</Link>
<Link href={`/plan/${planId}/edit`}>
        <div className='flex items-center justify-center size-[48px] rounded-[8px] bg-[#D0F65E] shadow-lg p-[8px]'>
          <Icon
            name='Columns'
            size={32}
            className='text-brand-gray-700'
          />
        </div>
        </Link>
      </div>

      {/* 계획 정보 카드 */}
      <div className='bg-white rounded-[8px] shadow-lg px-[16px] py-[8px] flex items-center justify-between flex-1 w-116'>
        <div className='flex items-center gap-[8px]'>
          {/* 계획 제목 */}
          <p className='text-typo-sub-title text-brand-blue-600 truncate max-w-[200px]'>{plan.title}</p>

          {/* 멤버 프로필 이미지 */}
          <div className='flex items-center'>
            {members.slice(0, 3).map((member, index) => (
              <div
                key={member.userId}
                className='relative size-[24px] rounded-full overflow-hidden border-2 border-white'
                style={{ marginLeft: index === 0 ? 0 : -8, zIndex: members.length - index }}
              >
                {member.profileImageUrl ? (
                  <Image
                    src={member.profileImageUrl}
                    alt={member.username}
                    fill
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
          <button aria-label='체크'>
            <Icon
              name='CheckboxChecked'
              size={32}
              className='text-brand-blue-600'
            />
          </button>
          <button aria-label='설정'>
            <Icon
              name='Setting'
              size={32}
              className='text-brand-blue-600'
            />
          </button>
        </div>
      </div>
    </div>
  );
}
