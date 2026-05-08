// components/auth/AuthorityWrapper.tsx
'use client';

import { useSession } from "next-auth/react";
import { AuthorityWrapperProps } from "@/types/authorityWrapper";

export default function AuthorityWrapper({ role, requiredRole, children, fallback=null }: AuthorityWrapperProps) {
  const { data: session } = useSession();
  
  // 1. 슈퍼 어드민인가? (auth.ts에서 주입한 속성 활용)
  const isSuperAdmin = session?.user?.isSuperAdmin;

  // 2. 해당 계획의 권한이 충분한가?
  const hasAccess = isSuperAdmin || role === 'master' || role === requiredRole;

  if (!hasAccess) return fallback || null;

  return <>{children}</>;
}