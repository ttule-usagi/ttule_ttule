'use client';

import AnswerBubble from './AnswerBubble';
import FormTypeSelect from '@/components/features/new-plan/plan-answer/form-inputs/FormTypeSelect';
import NextStepButton from './NextStepButton';

interface SelectOptionGroup {
  groupLabel: string;
  options: { label: string; value: string }[];
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  groups: SelectOptionGroup[];
  onNext: () => void;
  onOpenChange?: (open: boolean) => void; // 추가
}

export default function DestinationAnswer({ value, groups, onChange, onOpenChange, onNext }: Props) {
  return (
    <AnswerBubble>
      <AnswerBubble.Text>나는</AnswerBubble.Text>
      <FormTypeSelect
        id='destination'
        placeholder='여행할 지역을 검색해주세요'
        value={value}
        onChange={onChange}
        groups={groups}
        onOpenChange={onOpenChange}
      />
      <AnswerBubble.Text>지역을 여행할 예정이에요.</AnswerBubble.Text>
      <AnswerBubble.Action>
        <NextStepButton
          onClick={onNext}
          disabled={!value}
        />
      </AnswerBubble.Action>
    </AnswerBubble>
  );
}
