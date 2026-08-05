import Image from 'next/image';

import DropDown from '@/components/common/Dropdown';
import AuthorityWrapper from '@/components/features/AuthorityWrapper';
import { usePlanPlaceListStore } from '@/lib/store/planPlaceListStore';
import { usePlanSearchStore } from '@/lib/store/planSearchStore';
import { Role } from '@/types/shareOption';

export default function AddPlaceItem({
  hasSession,
  myRole,
  OnOpenNewMemo,
}: {
  hasSession: boolean;
  myRole: Role | null;
  OnOpenNewMemo: () => void;
}) {
  const { triggerFocus } = usePlanSearchStore();
  const { triggerOpenPlaceList } = usePlanPlaceListStore();

  return (
    <>
      {hasSession && (
        <AuthorityWrapper
          role={myRole}
          requiredRole='editor'
        >
          <div className=' z-10'>
            <DropDown>
              <DropDown.Trigger>
                <div className='flex items-center justify-center cursor-pointer hover:bg-brand-blue-900/20 hover:backdrop-blur-sm transition-colors duration-200 ease-in-out'>
                  <Image
                    src='/images/new-plan-item.svg'
                    alt='장소 추가'
                    width={375}
                    height={87}
                    style={{ width: 'auto' }}
                    loading='eager'
                  />
                </div>
              </DropDown.Trigger>

              <DropDown.Menu>
                <DropDown.Item onClick={triggerOpenPlaceList}>리스트에서 장소 가져오기</DropDown.Item>
                <DropDown.Item onClick={triggerFocus}>검색에서 장소 가져오기</DropDown.Item>
                <DropDown.Item onClick={OnOpenNewMemo}>장소 없는 일정 만들기</DropDown.Item>
              </DropDown.Menu>
            </DropDown>
          </div>
        </AuthorityWrapper>
      )}
    </>
  );
}
