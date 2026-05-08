import ModalBox from '@/components/common/Modal/ModalBox';

export default function EnterInviteLinkModal() {
  return (
    <ModalBox>
      <ModalBox.ModalTitle
        title='초대 링크 입력하기'
        description='초대받은 여행 계획의 공유 링크를 입력해주세요'
      />

      <div className='flex flex-col gap-1'>
        <p className='text-typo-caption text-brand-gray-400'>초대 링크</p>

        <ModalBox.ModalBottomContent>
          <input
            className='modal-input'
            placeholder='링크 입력하기'
          />
          <button className='modal-button'>확인</button>
        </ModalBox.ModalBottomContent>
      </div>
    </ModalBox>
  );
}
