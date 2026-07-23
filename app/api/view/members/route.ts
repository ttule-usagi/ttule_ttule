import { supabaseUser } from '@/lib/utils/supabase';
import { RPC_ERROR_TO_STATUS, RpcError, RpcErrorMessage } from '@/types/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const resourceId = request.nextUrl.searchParams.get('id');
  const resourceType = request.nextUrl.searchParams.get('resourceType');

  if (!resourceId || !resourceType) {
    return NextResponse.json({ error: 'INVALID_PARAMS' }, { status: 400 });
  }

  const supabase = await supabaseUser();

  try {
    const { data, error } = await supabase.rpc('get_members', {
      p_resource_id: resourceId,
      p_resource_type: resourceType,
    });
    if (error) throw new RpcError(error.message as RpcErrorMessage, error.code);
    return NextResponse.json(data ?? [], { status: 200 });
  } catch (error: unknown) {
    console.error('❌ 참여 유저 목록 호출 실패:', error);
    if (error instanceof RpcError) {
      return NextResponse.json(
        { error: error.message },
        { status: RPC_ERROR_TO_STATUS[error.message as RpcErrorMessage] ?? 500 },
      );
    }

    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
