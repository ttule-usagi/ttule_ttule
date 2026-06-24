'use client';

interface AnswerBubbleProps {
  children: React.ReactNode;
}

function AnswerBubble({ children }: AnswerBubbleProps) {
  return (
    <div className='relative self-end w-full max-w-71.5'>
      <div className='bg-gradient-to-b from-brand-blue-500 to-brand-blue-400 rounded-lg p-4 flex flex-col gap-2 text-typo-description text-brand-gray-400'>
        {children}
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
    </div>
  );
}

function AnswerBubbleText({ children }: { children: React.ReactNode }) {
  return <p className='text-typo-base text-brand-blue-50'>{children}</p>;
}

function AnswerBubbleAction({ children }: { children: React.ReactNode }) {
  return <div className='mt-1'>{children}</div>;
}

AnswerBubble.Text = AnswerBubbleText;
AnswerBubble.Action = AnswerBubbleAction;

export default AnswerBubble;
