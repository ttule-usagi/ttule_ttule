interface NotePageProps {
  title: string;
  children: React.ReactNode;
}

export default function NotePage({ title, children }: NotePageProps) {
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-dot-pattern bg-brand-blue-50'>
      <main className='w-140 min-h-190.75 px-7.25 py-24.5 bg-[url("/images/bg-note.svg")] bg-no-repeat bg-cover'>
        <div className='w-full h-full flex flex-col items-center justify-center'>
          <p className='text-typo-title w-full font-medium text-brand-blue-800 mb-29.25'>{title}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
