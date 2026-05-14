export const getProfileImageUrl = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const uploadResponse = await fetch('/api/image/profile', {
    method: 'POST',
    body: formData,
  });

  const uploadedData = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(uploadedData.message || '프로필 이미지 업로드에 실패했습니다.');
  }

  return uploadedData.url;
};
