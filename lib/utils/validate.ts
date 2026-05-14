// 유효성 검사 유틸 함수들을 모아둔 파일입니다.
export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password: string) =>
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);

export const validateUsername = (username: string) => /^[가-힣a-zA-Z0-9]{2,20}$/.test(username);
