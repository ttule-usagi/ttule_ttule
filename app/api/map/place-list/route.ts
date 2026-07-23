import { NextRequest, NextResponse } from 'next/server';

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
  const requestUrl = `https://maps.googleapis.com/maps/api/staticmap?size=1500x1000${markerString}&key=${GOOGLE_API_KEY}`;

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
