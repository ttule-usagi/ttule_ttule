import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';
import { getPlaceSearchResults } from '@/lib/api/placeSearch';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') ?? '';
  const limit = Number(searchParams.get('limit') ?? 10);
  const offset = Number(searchParams.get('offset') ?? 0);

  const supabase = await supabaseUser();

  try {
    const data = await getPlaceSearchResults({ supabase, query, limit, offset });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
