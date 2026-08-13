import { NextResponse } from 'next/server';

import { getUserInfo } from '@/lib/actions/api/user';
import { supabaseUser } from '@/lib/utils/supabase';
import { RPC_ERROR_TO_STATUS, RpcError, RpcErrorMessage } from '@/types/errors';

export async function GET() {
  const supabase = await supabaseUser();
  try {
    const data = await getUserInfo({ supabase });
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('❌ 프로필 조회 실패: ', error);

    if (error instanceof RpcError) {
      return NextResponse.json(
        { error: error.message },
        { status: RPC_ERROR_TO_STATUS[error.message as RpcErrorMessage] ?? 500 },
      );
    }

    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
