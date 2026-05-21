import { NextRequest, NextResponse } from 'next/server';

const DUMMY_DB = {
  0: [
    [
      '50.93811410569264',
      '6.954929367031603', // 쾰른
    ],
  ],
  1: [
    [
      '34.695073441117096',
      '135.50148279051817', //오사카
    ],
  ],
  2: [
    [
      '37.555614',
      '126.991577', // 서울
    ],
  ],
  3: [
    [
      '25.045438642576872',
      '121.56358769107352', // 타이베이
    ],
  ],
  4: [
    [
      '48.16467916914933',
      '108.64511519505224', // 울란바토르
    ],
  ],
};

export async function GET(request: NextRequest) {
  const listId = request.nextUrl.searchParams.get('listId');

  if (!listId) {
    return NextResponse.json({ error: 'listId is required' }, { status: 400 });
  }

  const coords = DUMMY_DB[listId];

  if (!coords || coords.length === 0) {
    return NextResponse.json({ error: 'No places found' }, { status: 404 });
  }

  const markerString = coords.map((coord: string) => `&markers=color:blue|label:P|${coord[0]},${coord[1]}`).join('');
  console.log('markerstring: ', markerString);
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const requestUrl = `https://maps.googleapis.com/maps/api/staticmap?size=1000x800${markerString}&key=${GOOGLE_API_KEY}`;

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
