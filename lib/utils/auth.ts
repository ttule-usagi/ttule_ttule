import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from '@/lib/utils/supabase';

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // profiles에서 유저 조회
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id, email, password, username, profile_image_url, role')
          .eq('email', credentials.email)
          .single();

        if (!profile) return null;

        // Google 가입 유저가 이메일 로그인 시도
        if (!profile.password) {
          throw new Error('GOOGLE_ACCOUNT');
        }

        // 비밀번호 검증
        const isValid = await bcrypt.compare(credentials.password as string, profile.password);

        if (!isValid) throw new Error('INVALID_PASSWORD');

        return {
          id: profile.id,
          email: profile.email,
          name: profile.username,
          image: profile.profile_image_url,
        };
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL! as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY! as string,
  }),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    newUser: '/signup/google',
  },
  events: {
    async createUser({ user }) {
      // next_auth.users insert 완료 후 실행됨
      // 여기서 profiles insert하면 FK 문제 없음
      if (!user.email) return;

      const randomNum = Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, '0');
      const randomNickname = `여행자#${randomNum}`;

      await supabaseAdmin.from('profiles').insert({
        id: user.id,
        email: user.email,
        username: randomNickname,
        profile_image_url: user.image,
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // console.log('✅ [SignIn Callback] 진입:', user.email);
      if (!user.email) return false;

      // 이메일 기준으로 기존 프로필이 있는지 먼저 확인(중복 가입 방지)
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      // Google 신규 유저
      // profiles 생성 -> /signup/google로 리디렉션
      // ***이메일 신규는 이미 signUpWithEmail()를 통해 회원가입을 마치고 로그인할때 이곳에 도달함
      if (!existingProfile && account?.provider === 'google') {
        const { cookies } = await import('next/headers');
        (await cookies()).set('is_new_google_user', 'true', { httpOnly: true });
        return true;
      }

      // 기존 유저가 구글 로그인 시도 BUT accounts 테이블에 연결 정보가 없는 경우
      // ex: 이메일로 가입했다가 동일한 이메일로 구글 로그인 시도
      if (existingProfile && account?.provider === 'google') {
        const { data: existingAccount } = await supabaseAdmin
          .schema('next_auth')
          .from('accounts')
          .select('id')
          .eq('userId', existingProfile.id)
          .eq('provider', 'google')
          .maybeSingle();

        if (!existingAccount) {
          // 서버에서 계정 연결 진행
          await supabaseAdmin.schema('next_auth').from('next_auth.accounts').insert({
            userId: existingProfile.id,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
            type: account?.type,
          });
          return true;
        }
      }

      // 그 외 모든 성공케이스(기존 유저, 이메일 가입 직후 등)은 로비로 이동
      return true;
    },

    async jwt({ token, user, trigger }) {
      // console.log('🔥 [JWT Callback] 실행됨!');
      // 최초 로그인 또는 update() 함수 호출 시에만 DB조회
      if (user || trigger === 'update') {
        const userId = user?.id || token.id;
        // console.log('🔍 [JWT] DB 조회 시작 - ID:', userId);
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .select('role, username, profile_image_url')
          .eq('id', userId)
          .single();

        // if (error) console.error('❌ [JWT] DB 조회 에러:', error);

        token.id = userId;
        token.role = data?.role;
        token.username = data?.username;
        token.picture = data?.profile_image_url;
      }
      return token;
    },
    async session({ session, token }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;

      if (signingSecret && token.sub) {
        session.supabaseAccessToken = jwt.sign(
          {
            aud: 'authenticated',
            exp: Math.floor(new Date(session.expires).getTime() / 1000),
            sub: token.sub,
            email: session.user.email,
            role: 'authenticated',
          },
          signingSecret,
        );
      }
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
