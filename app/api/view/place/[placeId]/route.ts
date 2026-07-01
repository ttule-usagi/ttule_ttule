import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;

  const supabase = await supabaseUser();

  try {
    const { data, error } = await supabase.rpc('get_core_place_detail', {
      p_core_place_id: placeId,
    });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ core place detail 에러:', error);

    if (error.code === '42501') {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
    if (error.code === 'P0002') {
      return NextResponse.json({ error: 'PLACE_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}