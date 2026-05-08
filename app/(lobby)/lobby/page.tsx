import JoinPlanButton from '@/components/features/JoinPlanButton';
import LobbyLastPlanItem from '@/components/features/Plan/LobbyLastPlanItem';
import LobbyPlanItem from '@/components/features/Plan/LobbyPlanItem';
import NoticeHeader from '@/components/features/NoticeHeader';
import Image from 'next/image';
import Link from 'next/link';

// 임시 데이터 - 추후 API 연동 시 제거 예정
const PlanItemList = [
  {
    id: 1,
    destination: 'KOR',
    departure: '2024-07-01',
    arrival: '2024-07-05',
    planName: '국내 여행 계획',
    party: 'group',
    updatedAt: '2min ago',
  },
  {
    id: 2,
    destination: 'JPN',
    departure: '2024-08-10',
    arrival: '2024-08-15',
    planName: '일본 여행 계획',
    party: 'single',
    updatedAt: '5min ago',
  },
  {
    id: 3,
    destination: 'USA',
    departure: '2024-05-01',
    arrival: '2024-05-10',
    planName: '미국 여행 계획',
    party: 'group',
    updatedAt: '1분 전 수정',
  },
  {
    id: 4,
    destination: 'FRA',
    departure: '2024-06-01',
    arrival: '2024-06-10',
    planName: '프랑스 여행 계획',
    party: 'single',
    updatedAt: '3분 전 수정',
  },
];

const LastPlanItemList = [
  {
    id: 3,
    destination: 'USA',
    departure: '2024-05-01',
    arrival: '2024-05-10',
    planName: '미국 여행 계획',
    party: 'group',
    updatedAt: '1분 전 수정',
  },
  {
    id: 4,
    destination: 'FRA',
    departure: '2024-06-01',
    arrival: '2024-06-10',
    planName: '프랑스 여행 계획',
    party: 'single',
    updatedAt: '3분 전 수정',
  },
  {
    id: 5,
    destination: 'ITA',
    departure: '2024-04-01',
    arrival: '2024-04-10',
    planName: '이탈리아 여행 계획',
    party: 'group',
    updatedAt: '5분 전 수정',
  },
  {
    id: 6,
    destination: 'ESP',
    departure: '2024-03-01',
    arrival: '2024-03-10',
    planName: '스페인 여행 계획',
    party: 'single',
    updatedAt: '10분 전 수정',
  },
  {
    id: 7,
    destination: 'GER',
    departure: '2024-02-01',
    arrival: '2024-02-10',
    planName: '독일 여행 계획',
    party: 'group',
    updatedAt: '15분 전 수정',
  },
];

export default function Page() {
  return (
    <div className='h-full max-w-350 min-w-230 mx-auto mt-5.5'>
      <NoticeHeader />
      <header className='flex items-center justify-between mt-10'>
        <div className='flex flex-col gap-0'>
          <p className='text-typo-big-title font-semibold text-brand-blue-700'>환영해요 닉네임님!</p>
          <p className='text-typo-sub-title font-medium text-brand-gray-400'>n개의 다가오는 여행이 있어요</p>
        </div>
        <div className='flex gap-3'>
          <JoinPlanButton variant='secondary' />
        </div>
      </header>

      <main className='mt-22.75 flex flex-col gap-19.5'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-4.5 text-typo-title text-brand-blue-800 font-medium'>
            <div className='w-2.5 h-2.5 bg-brand-blue-700'></div>
            다가오는 여행
          </div>
          <div className='grid grid-cols-[repeat(auto-fill,275.76px)] gap-10.75'>
            {PlanItemList.map((plan, index) => (
              <div
                key={plan.id}
                className={index % 2 !== 0 ? 'rotate-2' : '-rotate-2'}
              >
                <LobbyPlanItem {...plan} />
              </div>
            ))}
            <Link href='/plan/create'>
              <Image
                src='/images/lobby-create-plan.svg'
                width={272}
                height={392}
                alt='create plan'
                className='w-full h-auto'
              />
            </Link>
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-4.5 text-typo-title text-brand-blue-800 font-medium'>
            <div className='w-2.5 h-2.5 bg-brand-blue-700'></div>
            지난 여행
          </div>
          <div className='grid grid-cols-[repeat(auto-fill,340px)] gap-3.25'>
            {LastPlanItemList.map((plan) => (
              <LobbyLastPlanItem
                key={plan.id}
                {...plan}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
