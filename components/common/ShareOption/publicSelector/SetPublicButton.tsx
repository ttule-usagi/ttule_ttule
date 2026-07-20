import { ResourceType } from '@/types/invite';
import { IconButtonText } from './IconButtonText';
import { useConfirmSetPublic } from '@/hooks/shareOption/useConfirmSetPublic';

interface SetPublicButtonProps {
  id: string;
  resourceType: ResourceType;
  isSelected: boolean;
  disabled?: boolean;
}

// 공개 버튼
export function PublicButton({ id, resourceType, isSelected, disabled }: SetPublicButtonProps) {
  const { handleConfirmSetPublic, isPending } = useConfirmSetPublic({ id, resourceType });
  const buttonDescription = `누구나 이 ${resourceType === 'plan' ? '계획을' : '리스트를'} 볼 수 있어요`;

  return (
    <IconButtonText
      iconName='Globe'
      isSelected={isSelected}
      buttonText='공개'
      description={buttonDescription}
      onClick={() => handleConfirmSetPublic(true)}
      disabled={disabled || isPending}
    />
  );
}

//비공개 버튼
export function PrivateButton({ id, resourceType, isSelected, disabled }: SetPublicButtonProps) {
  const { handleConfirmSetPublic, isPending } = useConfirmSetPublic({ id, resourceType });
  const buttonDescription = `초대한 사람만 이 ${resourceType === 'plan' ? '계획을' : '리스트를'} 볼 수 있어요`;

  return (
    <IconButtonText
      iconName='Lock'
      isSelected={isSelected}
      buttonText='비공개'
      description={buttonDescription}
      onClick={() => handleConfirmSetPublic(false)}
      disabled={disabled || isPending}
    />
  );
}
