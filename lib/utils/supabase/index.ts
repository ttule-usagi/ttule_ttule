import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/utils/auth';

// 서버 컴포넌트용 (세션 기반, RLS 적용)
// export const supabaseUser = async () => {
//   const session = await auth();

//   return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
//     global: {
//       headers: {
//         Authorization: session?.supabaseAccessToken ? `Bearer ${session.supabaseAccessToken}` : '',
//       },
//     },
//   });
// };

export const supabaseUser = async () => {
  console.log('🔥 supabaseUser 함수 진입');
  const session = await auth();

  // 디버깅용 (개발 단계에서만 확인 후 지우세요!)
  console.log('Current Session Token:', session?.supabaseAccessToken);

  const headers: Record<string, string> = {};

  // 토큰이 있을 때만 Bearer 헤더를 구성합니다.
  // 만약 토큰이 없는데 'Bearer ' 문자열만 보내면 Supabase가 "키가 이상하다"며 화를 냅니다.
  if (session?.supabaseAccessToken) {
    headers.Authorization = `Bearer ${session.supabaseAccessToken}`;
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: headers,
    },
  });
};

// export const supabaseUser = async () => {
//   console.log('🔥 [DEBUG] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING');
//   console.log('🔥 [DEBUG] ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING');

//   const session = await auth();

//   // 1. RLS를 우회하고 싶다면 (Service Role 사용) -> 헤더를 아예 넣지 마세요.
//   // 2. RLS를 적용하고 싶다면 (Anon Key 사용) -> 유저 토큰을 헤더에 넣으세요.

//   // 테스트를 위해 일단 "RLS 무시" 버전으로 시도해봅시다.
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!, // .env에 이 이름이 정확히 있는지 확인!
//     {
//       auth: {
//         persistSession: false,
//       },
//     },
//   );
// };

// 어드민용 (서비스 롤 키, RLS 우회)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
