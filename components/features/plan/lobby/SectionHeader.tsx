export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className='flex items-center gap-2 md:gap-4.5 text-typo-base-bold md:text-typo-title text-brand-blue-800 font-medium'>
      <div className='w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-brand-blue-700'></div>
      {title}
    </div>
  );
}
