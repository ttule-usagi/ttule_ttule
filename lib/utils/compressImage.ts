import imageCompression, { Options } from 'browser-image-compression';

// 이미지 압축 유틸 함수
export const compressImage = async (file: File, customOptions?: Options) => {
  const options = customOptions || {
    maxSizeMB: 0.1, // 최대 100KB로 압축
    maxWidthOrHeight: 140, // 최대 가로 또는 세로 크기
    useWebWorker: true, // 브라우저 버벅거리지 않게 백그라운드 압축
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('이미지 압축 중 오류 발생:', error);
    return file;
  }
};
