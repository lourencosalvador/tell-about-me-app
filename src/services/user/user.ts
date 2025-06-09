import { api } from '../../api/client';
import { BASE_URL } from '../../constants/services';

export const getUserStreak = async (userId: string) => {
  const response = await api(`/users/${userId}/streak`, {
    timeout: 30000, // 30 segundos
  });
  return response;
};

export const updateUserProfile = async (userId: string, data: { name?: string; photoUrl?: string }) => {
  const response = await api(`/users/${userId}/profile`, {
    method: 'PATCH',
    body: data,
    timeout: 30000, // 30 segundos
  });
  return response;
};

export const uploadProfilePhoto = async (userId: string, imageUri: string) => {
  try {
    const formData = new FormData();
    
    // Criar objeto de arquivo para o FormData
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);

    console.log(`📸 Fazendo upload para: ${BASE_URL}/users/${userId}/upload-photo`);

    const response = await fetch(`${BASE_URL}/users/${userId}/upload-photo`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erro no upload da foto');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Erro no upload da foto:', error);
    throw error;
  }
}; 