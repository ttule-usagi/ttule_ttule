import SaveButton from '../save-button/SaveButton';

import ShareButton from './ShareButton';

interface PlaceActionBarProps {
  placeId: string;
  onAddToSchedule?: () => void;
  onSave?: () => void;
  savedListsCount: number;
  isSaved: boolean;
}

export default function PlaceActionBar({
  placeId,
  onAddToSchedule,
  onSave,
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
        iconName={isSaved ? 'BookmarkCheck' : 'Bookmark'}
        buttonText={isSaved ? `저장됨(${savedListsCount})` : '리스트 저장'}
        onClick={onSave}
        isSaved={isSaved}
      />

      {/* 공유 */}
      <ShareButton placeId={placeId} />
    </div>
  );
}
