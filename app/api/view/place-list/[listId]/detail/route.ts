import { getPlaceListDetail } from '@/lib/actions/api/placeList';
import { supabaseUser } from '@/lib/utils/supabase';
import { RPC_ERROR_TO_STATUS, RpcError, RpcErrorMessage } from '@/types/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const supabase = await supabaseUser();

  try {
    const data = await getPlaceListDetail({ supabase, listId });
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('❌ 리스트 상세 헤더 조회 실패: ', error);

    if (error instanceof RpcError) {
      return NextResponse.json(
        { error: error.message },
        { status: RPC_ERROR_TO_STATUS[error.message as RpcErrorMessage] ?? 500 },
      );
    }

    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
