import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';
import { getAutoCompletePlaces } from '@/lib/api/placeSearch';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') ?? '';
  const limit = Number(searchParams.get('limit') ?? 5);

  const supabase = await supabaseUser();

  try {
    const data = await getAutoCompletePlaces({ supabase, query, limit });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
