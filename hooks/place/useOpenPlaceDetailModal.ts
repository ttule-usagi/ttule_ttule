import { useSession } from 'next-auth/react';
import { useState } from 'react';

// 장소 상세 모달 관리 훅
export const useOpenPlaceDetailModal = () => {
  const { status } = useSession();
  const [isOpenPlaceModal, setIsOpenPlaceModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClickPlaceItem = (id: string) => {
    if (status !== 'authenticated') return;
    setSelectedId(id);
    setIsOpenPlaceModal(true);
  };

  const handleClosePlaceDetailModal = () => {
    setSelectedId(null);
    setIsOpenPlaceModal(false);
  };

  return {
    isOpenPlaceModal,
    selectedId,
    handleClickPlaceItem,
    handleClosePlaceDetailModal,
  };
};
