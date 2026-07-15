import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const supabase = await supabaseUser();

  try {
    const { data, error } = await supabase.rpc('get_plan_detail_single', {
      p_plan_id: planId,
    });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ get_plan_detail_single 에러:', error);
    if (error.code === '42501') {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
