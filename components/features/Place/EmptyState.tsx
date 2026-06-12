export default function EmptyState({ message }: { message: string }) {
  return <div className='w-full text-center py-7 text-brand-gray-400 text-typo-base'>{message}</div>;
}
