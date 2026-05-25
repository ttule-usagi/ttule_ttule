import { FormInputProps } from '@/types/input';

interface WithoutLineInputProps extends FormInputProps {
  errorText: string;
}

export default function WithoutLineInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  errorText,
}: WithoutLineInputProps) {
  return (
    <div className='flex flex-col'>
      <div className='w-full flex gap-3 py-2 text-typo-base font-light min-w-87.5'>
        <label htmlFor={id}>
          <div className='text-brand-blue-700 w-16'>{`${label} :`}</div>
        </label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className='w-full max-h-6 border-none focus:outline-none placeholder:text-brand-gray-400'
        />
      </div>
      {errorText && <p className='text-left w-full mt-1 text-typo-caption text-tag-red-text'>{errorText}</p>}
    </div>
  );
}
