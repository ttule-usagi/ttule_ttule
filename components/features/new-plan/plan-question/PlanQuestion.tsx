'use client';

interface Props {
  children: React.ReactNode;
}

export default function PlanQuestion({ children }: Props) {
  return (
    <div className='relative self-start max-w-[292px] mt-1'>
      <div className='bg-[#d9d9d9] rounded-lg px-4 py-3 '>
        <div className='text-typo-base text-black leading-relaxed whitespace-pre-line mr-5'>{children}</div>
      </div>
      {/* 왼쪽 하단 꼬리 */}
      <div
        className='absolute left-3 w-0 h-0'
        style={{
          bottom: '-9px',
          borderLeft: '14px solid #d9d9d9',
          borderRight: '0px solid transparent',
          borderTop: '9px solid #d9d9d9',
          borderBottom: '9px solid transparent',
          filter: 'drop-shadow(0 1px 0 #d9d9d9)',
        }}
      />
    </div>
  );
}
