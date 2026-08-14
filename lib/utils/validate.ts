// 유효성 검사 유틸 함수들을 모아둔 파일입니다.
// 이메일
export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getEmailErrorMessage = (email: string): string | null => {
  if (email.trim().length === 0) return '이메일을 입력해주세요.';
  if (!validateEmail(email)) return '유효하지 않은 이메일 형식입니다.';
  return null;
};

// 비밀번호
export const validatePassword = (password: string) =>
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);

export const getPasswordErrorMessage = (password: string): string | null => {
  if (password.trim().length === 0) return '비밀번호를 입력해주세요.';
  if (!validatePassword(password)) return '비밀번호는 8자 이상, 대문자와 특수문자를 포함해야 합니다.';
  return null;
};

// 닉네임
export const sanitizeUsername = (username: string) => username.trim().replace(/\s+/g, ' ');

export const validateUsername = (username: string) => {
  const cleaned = sanitizeUsername(username);
  return /^[가-힣a-zA-Z0-9]+(?: [가-힣a-zA-Z0-9]+)*$/.test(cleaned) && cleaned.length >= 2 && cleaned.length <= 9;
};

export const getUsernameErrorMessage = (username: string): string | null => {
  const cleaned = sanitizeUsername(username);
  const hasJamo = /[ㄱ-ㅎㅏ-ㅣ]/.test(cleaned);
  const hasInvalidChar = /[^가-힣a-zA-Z0-9 ]/.test(cleaned);

  if (username.trim().length === 0) return '닉네임을 입력해주세요.';
  if (hasJamo) return '자음/모음은 단독으로 사용할 수 없습니다.';
  if (hasInvalidChar) return '한글, 영문, 숫자, 공백만 사용할 수 있습니다.';
  if (cleaned.length < 2 || cleaned.length > 9) return '닉네임은 2-9자 이내로 입력해주세요.';
  return null;
};
