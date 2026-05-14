import { Storage } from '@google-cloud/storage';

// Base64로 인코딩된 GCP Credential을 가져와서 디코딩
const base64Credential = process.env.GCP_CREDENTIALS;

if (!base64Credential) {
  throw new Error('GCP_CREDENTIALS environment variable is not set');
}

// 디코딩된 Credential을 JSON 객체로 변환
const credentials = JSON.parse(Buffer.from(base64Credential, 'base64').toString('utf-8'));

// 복원된 JSON 객체로 GCP Storage 클라이언트 초기화
const storage = new Storage({ credentials });

export const bucketName = 'ttule-media';
export const bucket = storage.bucket(bucketName);
