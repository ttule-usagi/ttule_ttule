import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';
import { getPlaceListPlaces } from '@/lib/api/placeList';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  const { listId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const createdAt = searchParams.get('createdAt');
  const cursorId = searchParams.get('id');

  const supabase = await supabaseUser();

  try {
    const data = await getPlaceListPlaces({
      supabase,
      listId,
      cursor: createdAt && cursorId ? { createdAt, id: cursorId } : null,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ place-list places 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}