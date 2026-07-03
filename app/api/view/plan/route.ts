import { NextRequest, NextResponse } from 'next/server';
import { supabaseUser } from '@/lib/utils/supabase';

export async function GET(request: NextRequest) {
  const supabase = await supabaseUser();

  try {
    const { data, error } = await supabase.rpc('get_user_plans');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ get_user_plans 에러:', error);
    if (error.code === '42501') {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
