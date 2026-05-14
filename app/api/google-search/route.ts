import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { query, center } = await req.json();

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY!,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.shortFormattedAddress,places.primaryTypeDisplayName,places.location',
      Referer: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: 'ko-KR',
      // locationBias: {
      //   circle: {
      //     center: center || { latitude: 34.7024, longitude: 135.4959 }, // 기본값 오사카
      //     radius: 10000.0,
      //   },
      // },
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
