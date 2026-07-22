import { getPlaceListDetail } from '@/lib/actions/api/placeList';
import { supabaseUser } from '@/lib/utils/supabase';
import { RpcError } from '@/types/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const supabase = await supabaseUser();

  try {
    const data = await getPlaceListDetail({ supabase, listId });
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('❌ 리스트 상세 헤더 조회 실패: ', error);
    if (error instanceof RpcError && error.code === '42501') {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
