import { MemberAvatar } from '@/components/common/ShareOption/MemberAvatar';
import { PlaceListMember } from '@/types/placeList';

export default function ParticipantsImages({
  data,
  participantCount,
}: {
  data: PlaceListMember[];
  participantCount: number;
}) {
  const remainingCount = Math.max(0, participantCount - data.length);

  return (
    <div className='flex items-center'>
      {data &&
        data.map((user, index) => (
          <div
            key={user.id}
            className={`border-2 border-[#EBF1E5] rounded-full ${index !== 0 ? '-ml-1.5' : ''}`}
            style={{ zIndex: data.length - index }}
          >
            <MemberAvatar
              name={''}
              profileImage={user.profileImageUrl}
              size={20}
            />
          </div>
        ))}

      {remainingCount > 0 && (
        <div
          className='-ml-0.5 flex h-5 w-5 items-center justify-center text-typo-description text-[##F4F4F5] font-light'
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
