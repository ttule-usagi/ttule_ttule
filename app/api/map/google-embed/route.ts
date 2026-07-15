import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode'); // 'place' | 'search' | 'view'
  const googlePlaceId = searchParams.get('googlePlaceId');
  const query = searchParams.get('query');
  const center = searchParams.get('center') ?? '37.5665,126.9780';
  const zoom = searchParams.get('zoom') ?? '10';

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  let src = '';

  if (mode === 'place' && googlePlaceId) {
    src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${googlePlaceId}&language=ko&zoom=17&maptype=roadmap`;
  } else if (mode === 'search' && query) {
    src = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(query)}&language=ko&maptype=roadmap`;
  } else {
    src = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${center}&zoom=${zoom}&language=ko&maptype=roadmap`;
  }

  return NextResponse.json({ src });
}
