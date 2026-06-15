export default function ErrorState({ message }: { message: string }) {
  return <div className='w-full text-center py-7 text-tag-red-text text-typo-base'>{message}</div>;
}
