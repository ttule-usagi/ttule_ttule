import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import Google from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  }),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;

      if (signingSecret && token.sub) {
        const payload = {
          aud: 'authenticated',
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.sub,
          email: session.user.email,
          role: 'authenticated',
        };
        // supabase RLS 통과를 위한 전용 JWT 생성
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
