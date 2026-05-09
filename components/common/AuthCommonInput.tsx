interface AuthCommonInputProps {
  label: string;
  placeholder: string;
  error?: string;
}

export default function AuthCommonInput({ label, placeholder, error }: AuthCommonInputProps) {
  return (
    <div className='flex flex-col gap-1.5 w-full max-w-90'>
      <label className='text-typo-description text-[#344054]'>{label}</label>
      <input
        type='text'
        placeholder={placeholder}
        className='w-full h-12 rounded-lg border border-brand-gray-300 px-4 text-typo-base focus:outline-none shadow-xs'
      />
      {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
    </div>
  );
}
