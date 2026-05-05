'use client';

import { signInWithGoogle } from '@/lib/api/auth';
import GoogleLoginButton from '@/components/features/GoogleLoginButton';

export default function Login() {
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
