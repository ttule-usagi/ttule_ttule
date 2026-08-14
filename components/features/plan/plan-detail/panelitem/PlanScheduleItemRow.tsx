import { PlanItem } from '@/types/plan';
import { Role } from '@/types/shareOption';

import PlanItemCard from '../panelItemDetail/PlanItemCard';
import PlanItemEditCard from '../panelItemDetail/PlanItemEditCard';
import PlanMemoItemCard from '../panelItemDetail/PlanMemoItemCard';
import PlanMemoItemEditCard from '../panelItemDetail/PlanMemoItemEditCard';
import TransitInfo from '../panelItemDetail/TransitInfo';

interface PlanScheduleItemRowProps {
  item: PlanItem;
  hasNextPlaceItem: boolean;
  showTransitInfo: boolean;
  isEditing: boolean;
  hasSession: boolean;
  myRole: Role | null;
  isUpdating: boolean;
  onStartEdit: () => void;
  onCloseEdit: () => void;
  onSavePlace: (updated: { visitTime: string; memoContent: string }) => void;
  onSaveMemo: (updated: { placeName: string; visitTime: string | null; memoContent: string | null }) => void;
  onOpenDetail: () => void;
  onChangeSchedule: () => void;
  onOpenRouteModal: () => void;
}

export default function PlanScheduleItemRow({
  item,
  hasNextPlaceItem,
  showTransitInfo,
  isEditing,
  hasSession,
  myRole,
  isUpdating,
  onStartEdit,
  onCloseEdit,
  onSavePlace,
  onSaveMemo,
  onOpenDetail,
  onChangeSchedule,
  onOpenRouteModal,
}: PlanScheduleItemRowProps) {
  return (
    <>
      {item.type === 'memo' ? (
        isEditing ? (
          <PlanMemoItemEditCard
            item={item}
            onClose={onCloseEdit}
            onSave={onSaveMemo}
            isSaving={isUpdating}
          />
        ) : (
          <PlanMemoItemCard
            item={item}
            onClick={onStartEdit}
            onChangeSchedule={onChangeSchedule}
            hasSession={hasSession}
            myRole={myRole}
          />
        )
      ) : isEditing ? (
        <PlanItemEditCard
          item={item}
          onClose={onCloseEdit}
          onSave={onSavePlace}
          isSaving={isUpdating}
        />
      ) : (
        <PlanItemCard
          item={item}
          hasNextPlaceItem={hasNextPlaceItem}
          onOpenRouteModal={onOpenRouteModal}
          onClick={onStartEdit}
          onOpenDetail={onOpenDetail}
          onChangeSchedule={onChangeSchedule}
          hasSession={hasSession}
          myRole={myRole}
        />
      )}

      {showTransitInfo && item.transitMode && (
        <TransitInfo
          mode={item.transitMode}
          time={item.transitTime}
          hasMemo={!!item.transitMemo}
          onOpenRouteModal={onOpenRouteModal}
        />
      )}
    </>
  );
}
