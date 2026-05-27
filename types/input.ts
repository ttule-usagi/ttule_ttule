// 로그인, 회원가입 input 컴포넌트에 사용할 props 인터페이스 정의
export interface FormInputProps {
  id?: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 새로운 장소 등록 input 컴포넌트에 사용할 props 인터페이스 정의
export interface NewPlaceFormInputProps {
  id?: string;
  label: string;
  iconName: string | null;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
