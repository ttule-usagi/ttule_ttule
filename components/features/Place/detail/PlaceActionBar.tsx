import { Icon } from '@/components/common/Icon';
import SaveButton from './save-button/SaveButton';

interface PlaceActionBarProps {
  onAddToSchedule?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  savedListsCount: number;
  isSaved: boolean;
}

export default function PlaceActionBar({
  onAddToSchedule,
  onSave,
  onShare,
  savedListsCount,
  isSaved,
}: PlaceActionBarProps) {
  return (
    <div className='flex gap-2 items-center'>
      {/* 일정에 추가 */}
      <SaveButton
        iconName='CalendarPlus'
        buttonText='일정에 추가'
        onClick={onAddToSchedule}
      />

      {/* 장소 리스트에 저장 */}
      <SaveButton
        iconName='Bookmark'
        buttonText={isSaved ? `저장됨(${savedListsCount})` : '리스트 저장'}
        onClick={onSave}
      />

      {/* 공유 */}
      <button
        onClick={onShare}
        className='flex items-center justify-center p-2 border border-brand-gray-200 rounded-lg bg-white'
        aria-label='공유'
      >
        <Icon
          name='Share'
          size={24}
        />
      </button>
    </div>
  );
}
