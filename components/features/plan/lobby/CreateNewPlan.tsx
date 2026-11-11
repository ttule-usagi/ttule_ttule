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
        className='hidden md:block w-full h-auto'
      />
      <Image
        src='/images/lobby-create-plan-m.svg'
        width={370}
        height={96}
        alt='create plan mobile'
        className='md:hidden w-full aspect-[370/96] object-fill'
      />
    </Link>
  );
}
