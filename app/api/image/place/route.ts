// 장소 이미지 업로드 API 라우트
import { bucket } from '@/lib/gcp';
import { auth } from '@/lib/utils/auth';
import { NextRequest } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  // 1. 인증
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), {
      status: 401,
    });
  }

  // 2. 파일 받기
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), {
      status: 400,
    });
  }

  // 3. 파일 검증
  if (file.size > 10 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: '10MB 이하의 파일만 업로드 가능합니다.' }), { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return new Response(JSON.stringify({ error: '이미지 파일만 업로드 가능합니다.' }), { status: 400 });
  }

  // 4. GCS 업로드
  try {
    const buffer = await file.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);
    const webpBuffer = await sharp(nodeBuffer).webp({ quality: 80 }).toBuffer();

    const baseName = `${crypto.randomUUID()}-${Date.now()}`;
    const fileName = `${baseName}.webp`;
    // userId 포함 → 나중에 삭제 권한 검증에 활용
    const filePath = `places/${session.user.id}/${fileName}`;

    await bucket.file(filePath).save(webpBuffer, {
      contentType: 'image/webp',
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
  } catch (error) {
    console.error('Error uploading file to GCP Storage:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
      status: 500,
    });
  }
}
