export default function BottomButton({ children }: { children: React.ReactNode }) {
  return (
    <div className='sticky py-4 bg-white mt-auto w-full bottom-0 left-0 right-0 flex flex-col items-center justify-center z-10'>
      {children}
    </div>
  );
}
