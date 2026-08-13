import Image from 'next/image';

interface NotePageProps {
  title: string;
  children: React.ReactNode;
}

export default function NotePage({ title, children }: NotePageProps) {
  return (
    <div className='relative w-screen h-dvh flex items-center justify-center bg-dot-pattern bg-brand-blue-50 overflow-hidden'>
      <div className='relative w-140 h-190.75 shrink-0 z-10'>
        <Image
          src='/images/bg-note.svg'
          alt='Background Note'
          fill
          className='object-contain z-0'
        />
        <div className='relative w-full h-full flex flex-col z-10 overflow-y-auto justify-center items-center px-7.5'>
          <p className='text-typo-title w-full font-medium text-brand-blue-800 absolute top-24.5 px-7.5'>{title}</p>
          <div className='flex-1 flex flex-col items-center justify-center mt-34.75'>{children}</div>
        </div>
      </div>
    </div>
  );
}
