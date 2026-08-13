// 유효성 검사 유틸 함수들을 모아둔 파일입니다.
export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password: string) =>
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);

export const sanitizeUsername = (username: string) => username.trim().replace(/\s+/g, ' ');

export const validateUsername = (username: string) => {
  const cleaned = sanitizeUsername(username);
  return /^[가-힣a-zA-Z0-9]+(?: [가-힣a-zA-Z0-9]+)*$/.test(cleaned) && cleaned.length >= 2 && cleaned.length <= 9;
};

export const getUsernameErrorMessage = (username: string): string | null => {
  const cleaned = sanitizeUsername(username);
  const hasJamo = /[ㄱ-ㅎㅏ-ㅣ]/.test(cleaned);
  const hasInvalidChar = /[^가-힣a-zA-Z0-9 ]/.test(cleaned);

  if (hasJamo) return '자음/모음은 단독으로 사용할 수 없습니다.';
  if (hasInvalidChar) return '한글, 영문, 숫자, 공백만 사용할 수 있습니다.';
  if (cleaned.length < 2 || cleaned.length > 9) return '닉네임은 2-9자 이내로 입력해주세요.';
  return null;
};
