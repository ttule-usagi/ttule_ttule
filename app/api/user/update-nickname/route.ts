import { NextResponse } from 'next/server';
import { auth } from '@/lib/utils/auth'; // 서버 전용 auth
import { supabaseAdmin } from '@/lib/utils/supabase';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { nickname } = await req.json();

  const { error } = await supabaseAdmin.from('profiles').update({ username: nickname }).eq('email', session.user.email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
