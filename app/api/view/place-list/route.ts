import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';
import { getAllPlaceLists } from '@/lib/api/placeList'; 

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const listType = searchParams.get('listType') as 'owned' | 'shared';
  const offset = Number(searchParams.get('offset') ?? 0);

  const supabase = await supabaseUser();

  try {
    const data = await getAllPlaceLists({ supabase, listType, offset });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ place-list 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}