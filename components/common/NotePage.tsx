import Image from 'next/image';

interface NotePageProps {
  title: string;
  children: React.ReactNode;
}

export default function NotePage({ title, children }: NotePageProps) {
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-dot-pattern bg-brand-blue-50'>
      <Image
        src='/images/bg-note.svg'
        alt='Background Note'
        width={560}
        height={763}
        className='max-w-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 object-contain'
      />
      <div className='w-140 h-190.75 flex flex-col items-center justify-center z-10 px-7.5'>
        <p className='text-typo-title w-full font-medium text-brand-blue-800 mb-17.5'>{title}</p>
        {children}
      </div>
    </div>
  );
}
