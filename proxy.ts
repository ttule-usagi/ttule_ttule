import { auth } from '@/lib/utils/auth';
import { createSupabaseServerClient } from '@/lib/utils/supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export { auth as proxy };

// 보호할 라우트(로그인 없이 접근 불가)
export const config = {
  matcher: ['/lobby/:path*', '/places/:path*'],
};

// supabase 전용 인증 래퍼
export const supabaseProxy = async <T>(
  fetcher: (supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) => Promise<T>,
): Promise<T> => {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  const supabase = await createSupabaseServerClient();
  return fetcher(supabase);
};

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  // 로그인 안된 유저가 보호된 페이지에 갈 때
  const isProtectedInternalPage = nextUrl.pathname.startsWith('/lobby') || nextUrl.pathname.startsWith('/places');
  if (isProtectedInternalPage && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});
