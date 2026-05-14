import { bucket } from '@/lib/gcp';
import { NextRequest } from 'next/server';

// 프로필 이미지 업로드 API 라우트
export async function POST(request: NextRequest) {
  // 클라이언트로부터 이미지 파일을 받음
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // GCP Storage에 파일 업로드
    const baseName = `${crypto.randomUUID()}-${Date.now()}`;
    const fileName = `${baseName}.webp`;
    const filePath = `profiles/${fileName}`;

    await bucket.file(filePath).save(buffer, {
      contentType: 'image/webp',
      metadata: {
        cacheControl: 'public, max-age=31536000', // 1년 캐싱
      },
    });

    // 업로드된 파일의 공개 URL 반환
    const image_Url = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    return new Response(JSON.stringify({ url: image_Url }), { status: 200 });
  } catch (error) {
    console.error('Error uploading file to GCP Storage:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload file' }), { status: 500 });
  }
}
