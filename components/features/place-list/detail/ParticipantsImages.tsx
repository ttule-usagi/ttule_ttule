import { MemberAvatar } from '@/components/common/ShareOption/MemberAvatar';
import { PlaceListMember } from '@/types/placeList';

export default function ParticipantsImages({ data }: { data: PlaceListMember[] }) {
  return (
    <>
      {data &&
        data.map((user) => (
          <div key={user.id}>
            <MemberAvatar
              name={user.username}
              profileImage={user.profileImage}
              size={24}
            />
          </div>
        ))}
    </>
  );
}
