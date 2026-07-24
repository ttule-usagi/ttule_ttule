export class AuthError extends Error {
  field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}

export type RpcErrorMessage =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'CANNOT_REMOVE_SELF'
  | 'INTERNAL_ERROR';

// SQLSTATE → RpcErrorMessage
export const SQLSTATE_TO_RPC_ERROR: Record<string, RpcErrorMessage> = {
  '42501': 'UNAUTHORIZED',
  '23505': 'CONFLICT',
  P0002: 'NOT_FOUND',
  P0001: 'FORBIDDEN',
  '23502': 'VALIDATION_ERROR',
  SELF1: 'CANNOT_REMOVE_SELF',
};

// RpcErrorMessage → HTTP status
export const RPC_ERROR_TO_STATUS: Record<RpcErrorMessage, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
  CANNOT_REMOVE_SELF: 409,
};

// 에러 메시지 템플릿
export const ERROR_MESSAGES: Record<RpcErrorMessage, string> = {
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '대상을(를) 찾을 수 없습니다.',
  CONFLICT: '이(가) 이미 존재합니다.',
  VALIDATION_ERROR: '입력값을 확인해주세요.',
  INTERNAL_ERROR: '중 오류가 발생했습니다.',
  CANNOT_REMOVE_SELF: '자기 자신은 삭제할 수 없습니다.',
};

export function getErrorMessage(code: RpcErrorMessage, { action, subject }: { action: string; subject: string }) {
  switch (code) {
    case 'INTERNAL_ERROR':
      return `${subject} ${action} 중 오류가 발생했습니다.`;
    case 'NOT_FOUND':
      return `${subject}을(를) 찾을 수 없습니다.`;
    case 'CONFLICT':
      return `${subject}이(가) 이미 존재합니다.`;
    case 'UNAUTHORIZED':
      return '로그인이 필요합니다.';
    case 'FORBIDDEN':
      return '권한이 없습니다.';
    case 'VALIDATION_ERROR':
      return '입력값을 확인해주세요.';
    case 'CANNOT_REMOVE_SELF':
      return '자기 자신은 삭제할 수 없습니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
}

// 조회 함수에서 사용하는 에러 클래스
export class RpcError extends Error {
  code?: string;
  constructor(message: RpcErrorMessage, code?: string) {
    super(message);
    this.name = 'RpcError';
    this.code = code;
    Object.setPrototypeOf(this, RpcError.prototype);
  }
}

// 서버 액션('use server')에서 사용하는 반환 타입
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { message: RpcErrorMessage; code?: string } };

// 타입가드
export function isPostgresError(error: unknown): error is { code: string; message: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

// 조회 함수 Router Handler 응답타입
export interface RpcErrorResponseBody {
  error: RpcErrorMessage;
  code?: string;
}
