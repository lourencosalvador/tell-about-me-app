// services/videos.ts
import { api } from '@/src/api/client';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';

export interface UserVideo {
  id: string;
  url: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  transcription?: string | null;
  thumbnail?: string;
  duration?: number;
  fileSize?: number;
}

export interface UserVideosResponse {
  videos: UserVideo[];
}

export interface UploadVideoResponse {
  videoId: string;
  audioId: string;
  videoUrl: string;
  conquistouStreak?: boolean;
  message: string;
}

export interface DeleteVideoResponse {
  success: boolean;
  message: string;
}

/**
 * Upload de vídeo com controle de progresso e detecção de streak
 */
export async function uploadVideo({
  userId,
  fileUri,
  onProgress,
}: {
  userId: string;
  fileUri: string;
  onProgress?: (progress: number) => void;
}): Promise<{ success: boolean; data?: UploadVideoResponse; error?: string }> {
  try {
    console.log(`📤 Iniciando upload de vídeo para usuário: ${userId}`);
    console.log(`📁 Arquivo: ${fileUri}`);

    // Verificar se o arquivo existe
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('Arquivo não encontrado');
    }

    console.log(`📊 Tamanho do arquivo: ${fileInfo.size} bytes`);

    // Fazer upload com progresso
    const uploadResult = await FileSystem.uploadAsync(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/videos/upload?userId=${userId}`,
      fileUri,
      {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('📡 Upload response status:', uploadResult.status);
    console.log('📡 Upload response body:', uploadResult.body);

    if (uploadResult.status === 200) {
      const data: UploadVideoResponse = JSON.parse(uploadResult.body);
      
      // Se conquistou streak, navegar para tela de streak
      if (data.conquistouStreak) {
        console.log('🔥 STREAK CONQUISTADO! Navegando para tela de streak...');
        router.push('/(stacks)/progress/streak');
      }
      
      return { success: true, data };
    } else {
      // Tentar fazer parse do erro
      let errorMessage = 'Erro no upload';
      try {
        const errorData = JSON.parse(uploadResult.body);
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Se não conseguir fazer parse, usar mensagem padrão
      }
      
      console.error('❌ Upload falhou:', errorMessage);
      return { success: false, error: errorMessage };
    }

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no upload';
    return { success: false, error: errorMessage };
  }
}

/**
 * Buscar vídeos do usuário
 */
export async function getUserVideos(userId: string): Promise<UserVideosResponse> {
  try {
    console.log(`📹 Buscando vídeos do usuário: ${userId}`);
    
    const response = await api<UserVideosResponse>(`/users/${userId}/videos`, {
      timeout: 30000, // 30 segundos para buscar vídeos
    });
    
    console.log(`✅ ${response.videos.length} vídeos encontrados`);
    return response;
  } catch (error) {
    console.error('❌ Erro ao buscar vídeos:', error);
    throw error;
  }
}

/**
 * Deletar vídeo
 */
export async function deleteVideo(videoId: string): Promise<DeleteVideoResponse> {
  try {
    console.log(`🗑️ Deletando vídeo: ${videoId}`);
    
    const response = await api<DeleteVideoResponse>(`/videos/${videoId}`, {
      method: 'DELETE',
    });
    
    console.log(`✅ Vídeo deletado com sucesso`);
    return response;
  } catch (error) {
    console.error('❌ Erro ao deletar vídeo:', error);
    throw error;
  }
}

const sendAudioForTranscription = async (audioUri: string): Promise<{ transcription: string }> => {
  try {
    if (!audioUri) {
      throw new Error('URI do áudio não fornecida');
    }

    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) {
      throw new Error('Arquivo de áudio não encontrado');
    }

    const audioData = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await api<{ transcription: string }>('/audio/transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/wav',
      },
      body: audioData,
    });

    return {
      transcription: response.transcription
    };

  } catch (error: any) {
    console.error('❗ Erro na transcrição de áudio:', error);
    throw new Error(`Falha na transcrição: ${error.message}`);
  }
};

export const ServiceVideos = {
  uploadVideo,
  getUserVideos,
  deleteVideo,
  sendAudioForTranscription,
};
