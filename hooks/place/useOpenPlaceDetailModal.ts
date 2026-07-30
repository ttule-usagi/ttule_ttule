import { useState } from 'react';

// 장소 상세 모달 관리 훅
export const useOpenPlaceDetailModal = () => {
  const [isOpenPlaceModal, setIsOpenPlaceModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClickPlaceItem = (id: string) => {
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
