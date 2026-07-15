import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';
import { getPlanDetail } from '@/lib/api/plan';

export async function GET(request: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const supabase = await supabaseUser();

  try {
    const data = await getPlanDetail({ supabase, planId });
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.code === '42501') {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
