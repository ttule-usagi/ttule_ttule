// actions/storage.ts
'use server';

import { bucket } from '@/lib/gcp';
import { auth } from '@/lib/utils/auth';

export async function deleteImage(url: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  const prefix = `https://storage.googleapis.com/${bucket.name}/`;
  if (!url.startsWith(prefix)) {
    return { success: false, error: 'Invalid URL' };
  }
  const filePath = url.slice(prefix.length);

  if (!filePath.startsWith(`places/${session.user.id}/`)) {
    return { success: false, error: '권한이 없습니다.' };
  }

  try {
    await bucket.file(filePath).delete();
    return { success: true };
  } catch (error) {
    console.error('Delete image error:', error);
    return { success: false, error: 'Failed to delete file' };
  }
}
