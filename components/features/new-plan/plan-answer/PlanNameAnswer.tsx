'use client';

import AnswerBubble from './AnswerBubble';
import FormTypeText from '@/components/features/new-plan/plan-answer/form-inputs/FormTypeText';
import NextStepButton from './NextStepButton';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  isPending?: boolean; // 추가
}

export default function PlanNameAnswer({ value, onChange, onNext, isPending }: Props) {
  return (
    <AnswerBubble>
      <AnswerBubble.Text>계획의 이름은</AnswerBubble.Text>
      <FormTypeText
        id='plan_name'
        placeholder='문자열 2-9자리로 입력'
        value={value}
        onChange={onChange}
      />
      <AnswerBubble.Text>로 할게요.</AnswerBubble.Text>
      <AnswerBubble.Action>
        <NextStepButton
          onClick={onNext}
          disabled={value.trim().length < 2 || isPending}
          label={isPending ? '생성 중...' : '다음단계'}
        />
      </AnswerBubble.Action>
    </AnswerBubble>
  );
}
