import { ShareLinkBaseModal } from '@/components/common/ShareLinkBaseModal';
import { useModalStore } from '@/lib/store/modalStore';

export default function EnterInviteLinkModal() {
  const { close } = useModalStore();
  return (
    <ShareLinkBaseModal
      title='초대 링크 입력하기'
      description='초대받은 여행 계획의 공유 링크를 입력해주세요'
      onClose={close}
    >
      <div className='flex flex-col gap-1'>
        <p className='text-typo-caption text-brand-gray-400'>초대 링크</p>

        <div className='flex gap-2.5'>
          <input
            className='modal-input'
            placeholder='링크 입력하기'
          />
          <button className='modal-button'>확인</button>
        </div>
      </div>
    </ShareLinkBaseModal>
  );
}
