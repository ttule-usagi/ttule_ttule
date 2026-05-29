import { FormInputProps } from '@/types/input';

// 로그인에 사용되는 FormInput 컴포넌트
export default function FormInput({ id, label, type = 'text', placeholder, value, onChange }: FormInputProps) {
  return (
    <div className='flex flex-col gap-1.5 w-full max-w-90'>
      <label
        htmlFor={id}
        className='text-typo-description text-login-label font-light'
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='w-full max-h-11 rounded-lg border border-[#D0D5DD] px-3.5 py-2.5 text-typo-base font-light focus:outline-none shadow-xs placeholder:text-login-placeholder'
      />
    </div>
  );
}
