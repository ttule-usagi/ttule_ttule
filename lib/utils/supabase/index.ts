import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/utils/auth';

// 서버 컴포넌트용 (세션 기반, RLS 적용)

// 헤더를 끄고 보내면 anon유저(비인증 유저)로 인식합니다.
// 따라서 supabaseUser를 사용시에는 사용되는 RPC의 security가 DEFINER여야하며,
// 호출시 인자에 p_user_id: session.user.id 유저 아이디를 꼭 넣어줘야합니다.

export const supabaseUser = async () => {
  const session = await auth();

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        // Authorization: session?.supabaseAccessToken ? `Bearer ${session.supabaseAccessToken}` : '',
      },
    },
  });
};

// export const supabaseUser = async () => {
//   console.log('🔥 supabaseUser 함수 진입');
//   const session = await auth();

//   // 디버깅용 (개발 단계에서만 확인 후 지우세요!)
//   console.log('Current Session Token:', session?.supabaseAccessToken);

//   const headers: Record<string, string> = {};

//   // 토큰이 있을 때만 Bearer 헤더를 구성합니다.
//   // 만약 토큰이 없는데 'Bearer ' 문자열만 보내면 Supabase가 "키가 이상하다"며 화를 냅니다.
//   if (session?.supabaseAccessToken) {
//     headers.Authorization = `Bearer ${session.supabaseAccessToken}`;
//   }

//   return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
//     global: {
//       headers: headers,
//     },
//   });
// };

// 어드민용 (서비스 롤 키, RLS 우회)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
