import { auth } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyInviteToken } from './lib/actions/invite';

export { middleware as proxy };

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const session = await auth();

  console.log('--------------------------------------------------');
  console.log(`🚀 [PROXY CHECK] 경로: ${pathname}`);
  console.log(`세션 상태: ${session ? '✅ 로그인됨' : '❌ 미인증'}`);
  if (session?.user) {
    console.log(`유저 정보: ${session.user.email} (${session.user.username || '닉네임 없음'}) ${session.user.role}`);
  }
  console.log('--------------------------------------------------');

  const isNewGoogleUser = request.cookies.get('is_new_google_user');

  // 1. 신규 유저 쿠키 처리
  if (session && isNewGoogleUser && !pathname.startsWith('/signup/google')) {
    return NextResponse.redirect(new URL('/signup/google', request.url));
  }

  // 2. 세션이 있는데 /login 접근 시 로비로
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/lobby', request.url));
  }

  // 3. 초대 토큰이 있는 /places, /plan 접근: 세션 여부와 무관하게 토큰 검증으로 먼저 분기
  const inviteToken = searchParams.get('invite_token');
  const isPlaceList = pathname.startsWith('/places/');
  const isPlan = pathname.startsWith('/plan/');

  if ((isPlaceList || isPlan) && inviteToken) {
    const resourceId = pathname.split('/')[2];
    const resourceType = isPlaceList ? 'place_list' : 'plan';

    const status = await verifyInviteToken({
      token: inviteToken,
      id: resourceId,
      type: resourceType,
    });

    if (status === 'INVALID' || status === 'EXPIRED') {
      return NextResponse.rewrite(new URL('/invite-invalid', request.url));
    }
  }

  // 3. 보호된 경로 세션 체크
  const isProtectedRoute = pathname.startsWith('/lobby') || pathname.startsWith('/places');
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
