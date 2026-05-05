'use client';

import { signInWithGoogle } from '@/lib/api/auth';
import GoogleLoginButton from '@/components/features/GoogleLoginButton';

export default function Login() {
  console.log(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return (
    <div>
      <GoogleLoginButton
        onClick={() => {
          signInWithGoogle();
        }}
      />
    </div>
  );
}
