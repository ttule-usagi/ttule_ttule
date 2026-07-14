export class AuthError extends Error {
  field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}

// 조회 함수용 에러 클래스 (throw)
// DB/RPC에서 온 에러 코드를 UI에 전달할 때 사용
export class RpcError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'RpcError';
    this.code = code;
  }
}

// 서버 액션용 결과 타입 (return)
// 서버 액션('use server') 에러는 훅에서 잡아내지 못하기 때문에 RpcError 클래스가 아닌 해당 타입 사용 필요
export type ActionResult<T = { success: true }> = T | { error: string; code?: string };
