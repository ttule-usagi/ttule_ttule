import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { planId: _ } = await params; // planId는 경로에만 사용
  const scheduleId = request.nextUrl.searchParams.get('scheduleId');

  if (!scheduleId) {
    return NextResponse.json({ error: 'INVALID_SCHEDULE_ID' }, { status: 400 });
  }

  const supabase = await supabaseUser();

  try {
    const { data, error } = await supabase.rpc('get_schedule_items', {
      p_schedule_id: scheduleId,
    });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ get_schedule_items 에러:', error);
    if (error.code === '42501') {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
