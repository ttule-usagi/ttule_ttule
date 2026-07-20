import { supabaseUser } from '@/lib/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const resourceId = request.nextUrl.searchParams.get('id');
  const resourceType = request.nextUrl.searchParams.get('resourceType');

  if (!resourceId || !resourceType) {
    return NextResponse.json({ error: 'INVALID_PARAMS' }, { status: 400 });
  }

  const supabase = await supabaseUser();

  try {
    const { data, error } = await supabase.rpc('get_members', {
      p_resource_id: resourceId,
      p_resource_type: resourceType,
    });

    if (error) throw error;
    return NextResponse.json(data ?? [], { status: 200 });
  } catch (error: any) {
    console.error('❌ 참여 유저 목록 호출 실패:', error);
    if (error.code === '42501') {
      return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    }
    return NextResponse.json({ error: '참여 유저 목록을 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
