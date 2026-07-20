import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';
import { getScheduleItems } from '@/lib/actions/api/plan';

export async function GET(request: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { planId: _ } = await params;
  const scheduleId = request.nextUrl.searchParams.get('scheduleId');

  if (!scheduleId) {
    return NextResponse.json({ error: 'INVALID_SCHEDULE_ID' }, { status: 400 });
  }

  const supabase = await supabaseUser();

  try {
    const data = await getScheduleItems({ supabase, scheduleId });
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.code === '42501') {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
