import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    supabaseAccessToken?: string;
    user: {
      id: string;
      role: string;
      username: string;
      isSuperAdmin?: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    username?: string;
  }
}
