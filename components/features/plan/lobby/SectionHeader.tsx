export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className='flex items-center gap-4.5 text-typo-title text-brand-blue-800 font-medium'>
      <div className='w-2.5 h-2.5 bg-brand-blue-700'></div>
      {title}
    </div>
  );
}
