import Image from 'next/image';
import Link from 'next/link';

export default function CreateNewPlan() {
  return (
    <Link href='/plan-create'>
      <Image
        src='/images/lobby-create-plan.svg'
        width={272}
        height={392}
        alt='create plan'
        className='w-full h-auto'
      />
    </Link>
  );
}
