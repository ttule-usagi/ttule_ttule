import Image from 'next/image';

interface NotePageProps {
  title: string;
  children: React.ReactNode;
}

export default function NotePage({ title, children }: NotePageProps) {
  return (
    <div className='relative w-screen h-dvh flex items-center justify-center bg-dot-pattern bg-brand-blue-50 overflow-hidden'>
      <div className='relative w-full h-full md:w-140 md:h-190.75 shrink-0 z-10'>
        <div
          aria-hidden
          className='absolute top-8 inset-0 z-0 md:hidden bg-note-mobile'
        />
        <Image
          src='/images/bg-note.svg'
          alt='Background Note'
          fill
          className='hidden md:block object-contain z-0'
        />
        <div className='relative w-full h-full flex flex-col z-10 overflow-y-auto justify-center items-center px-7.5'>
          <p className='text-typo-title w-full font-medium text-brand-blue-800 absolute top-24.5 px-7.5'>{title}</p>
          <div className='flex md:flex-1 flex-col items-center justify-center h-mini:mt-25 md:mt-34.75'>{children}</div>
        </div>
      </div>
    </div>
  );
}
