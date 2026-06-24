'use client';

interface Props {
  label?: string;
  onClick: () => void;
}

export default function SkipButton({ label = '나중에 할게요.', onClick }: Props) {
  return (
    <div className='flex flex-col items-end gap-1 self-end'>
      <div className='relative'>
        <div className='bg-gradient-to-b from-brand-blue-500 to-brand-blue-400 rounded-lg p-4'>
          <button
            type='button'
            onClick={onClick}
            className='bg-white rounded-lg px-3 py-2 text-typo-description text-brand-blue-700 font-medium whitespace-nowrap cursor-pointer hover:bg-brand-blue-50'
          >
            {label}
          </button>
        </div>
        {/* 오른쪽 하단 꼬리 */}
        <div
          className='absolute right-3 w-0 h-0'
          style={{
            bottom: '-9px',
            borderRight: '14px solid #5187FC',
            borderLeft: '0px solid transparent',
            borderTop: '9px solid #5187FC',
            borderBottom: '9px solid transparent',
          }}
        />
        <p className='absolute left-0 bottom-[-20px] text-typo-caption text-brand-blue-400 pr-1'>클릭하고 넘기기</p>
      </div>
    </div>
  );
}
