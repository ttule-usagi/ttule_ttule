import { NextRequest, NextResponse } from 'next/server';

const DUMMY_DB = {
  0: [
    '35.6895,139.6917', // 더미 마커 1
    '35.6586,139.7454', // 더미 마커 2
  ],
  1: [
    '35.7147,139.7966', // 더미 마커 3
    '33.5902,130.4017', // 후쿠오카
  ],
  2: [
    '38.7147,139.7966', // 더미 마커 3
    '33.5902,130.4017', // 후쿠오카
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listId = searchParams.get('listId');

  if (!listId) {
    return NextResponse.json({ error: 'listId is required' }, { status: 400 });
  }

  const coords = DUMMY_DB[listId];

  if (!coords || coords.length === 0) {
    return NextResponse.json({ error: 'No places found' }, { status: 404 });
  }

  const markerString = coords.map((coord: any) => `&markers=color:blue|label:P|${coord}`);
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const requestUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400${markerString}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(requestUrl);
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Map generation failed' }, { status: 500 });
  }
}
