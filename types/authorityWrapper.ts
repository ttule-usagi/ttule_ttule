// types/auth.ts (따로 분리하거나 컴포넌트 파일 상단에 정의)
import { ReactNode } from 'react';

// 계획 내에서의 권한 타입
export type PlanRole = 'master' | 'editor' | null | undefined;

export interface AuthorityWrapperProps {
  /** DB(plan_member)에서 가져온 현재 사용자의 권한 */
  role: PlanRole;
  
  /** 해당 영역을 보기 위해 최소한으로 필요한 권한 */
  requiredRole: 'master' | 'editor';
  
  /** 권한이 충족되었을 때 보여줄 요소 */
  children: ReactNode;
  
  /** 권한이 없을 때 보여줄 요소 (선택 사항) */
  fallback?: null;
}
