import { FormInputProps } from '@/types/input';

interface WithoutLineInputProps extends FormInputProps {
  errorText?: string;
  maxLength?: number;
}

export default function WithoutLineInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  errorText,
  maxLength,
}: WithoutLineInputProps) {
  return (
    <div className='flex flex-col'>
      <div className='w-full flex gap-3 py-2 text-typo-base font-light'>
        <label htmlFor={id}>
          <div className='text-brand-blue-700 shrink-0'>{`${label} :`}</div>
        </label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className='inline-block min-w-0 w-full max-h-6 border-none focus:outline-none placeholder:text-brand-gray-400 flex-1'
        />
      </div>
      {errorText && <p className='text-left w-full mt-1 text-typo-caption text-tag-red-text'>{errorText}</p>}
    </div>
  );
}
