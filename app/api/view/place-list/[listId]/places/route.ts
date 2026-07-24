import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';
import { getPlaceListPlaces } from '@/lib/actions/api/placeList';
import { SortType } from '@/types/placeList';
import { RPC_ERROR_TO_STATUS, RpcError, RpcErrorMessage } from '@/types/errors';

export async function GET(request: NextRequest, { params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const createdAt = searchParams.get('createdAt');
  const cursorId = searchParams.get('id');
  const sortBy = (searchParams.get('sortBy') as SortType) ?? 'created_desc';

  const supabase = await supabaseUser();

  try {
    const data = await getPlaceListPlaces({
      supabase,
      listId,
      sortBy,
      cursor: createdAt && cursorId ? { createdAt, id: cursorId } : null,
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('❌ 저장된 장소 조회 실패:', error);

    if (error instanceof RpcError) {
      return NextResponse.json(
        { error: error.message },
        { status: RPC_ERROR_TO_STATUS[error.message as RpcErrorMessage] ?? 500 },
      );
    }

    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
