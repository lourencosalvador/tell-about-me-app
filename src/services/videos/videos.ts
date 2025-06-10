// services/videos.ts
import { api } from '@/src/api/client';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import { BASE_URL } from '@/src/constants/services';
import { notificationService } from '@/src/services/notifications/notificationService';
import { AppState } from 'react-native';

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

interface ChunkUploadResponse {
  success: boolean;
  chunkIndex: number;
  uploadId?: string;
  error?: string;
}

interface InitiateUploadResponse {
  uploadId: string;
  presignedUrls: string[];
}

interface CompleteUploadResponse {
  success: boolean;
  videoId: string;
  audioId: string;
  videoUrl: string;
  conquistouStreak?: boolean;
  message: string;
}

/**
 * Upload de vídeo com chunking/streaming para vídeos grandes
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
    console.log(`📤 Iniciando upload streaming para usuário: ${userId}`);
    console.log(`📁 Arquivo: ${fileUri}`);

    // Verificar se o arquivo existe
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('Arquivo não encontrado');
    }

    const fileSizeMB = fileInfo.size / (1024 * 1024);
    console.log(`📊 Tamanho do arquivo: ${fileInfo.size} bytes (${fileSizeMB.toFixed(2)}MB)`);

    // Se arquivo é pequeno (< 5MB), usar upload direto tradicional
    if (fileInfo.size < 5 * 1024 * 1024) {
      console.log('📦 Arquivo pequeno - usando upload direto');
      return await uploadSmallVideo(userId, fileUri, onProgress);
    }

    // Para arquivos grandes, usar upload por chunks
    console.log('📦 Arquivo grande - usando upload streaming por chunks');
    return await uploadLargeVideoWithChunks(userId, fileUri, fileInfo.size, onProgress);

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no upload';
    
    // Enviar notificação de erro
    const fileName = fileUri.split('/').pop() || 'video.mp4';
    await notificationService.sendUploadErrorNotification(fileName, errorMessage);
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Upload direto para arquivos pequenos (< 5MB)
 */
async function uploadSmallVideo(
  userId: string, 
  fileUri: string, 
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; data?: UploadVideoResponse; error?: string }> {
  try {
    // Progresso suave para arquivos pequenos
    onProgress?.(10); // Iniciando...
    
    console.log('📡 Fazendo upload de arquivo pequeno...');
    
    const uploadResult = await FileSystem.uploadAsync(
      `${BASE_URL}/videos/upload?userId=${userId}`,
      fileUri,
      {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
      }
    );

    onProgress?.(100);

    if (uploadResult.status === 200) {
      const data: UploadVideoResponse = JSON.parse(uploadResult.body);
      
      // Enviar notificação de sucesso
      const fileName = fileUri.split('/').pop() || 'video.mp4';
      const wasBackground = AppState.currentState !== 'active';
      await notificationService.sendUploadCompleteNotification(fileName, wasBackground);
      
      if (data.conquistouStreak) {
        router.push('/(stacks)/progress/streak');
      }
      
      return { success: true, data };
    } else {
      let errorMessage = 'Erro no upload';
      try {
        const errorData = JSON.parse(uploadResult.body);
        errorMessage = errorData.error || errorMessage;
      } catch {}
      
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro no upload direto';
    return { success: false, error: errorMessage };
  }
}

/**
 * Upload por chunks para arquivos grandes (>= 5MB)
 */
async function uploadLargeVideoWithChunks(
  userId: string,
  fileUri: string,
  fileSize: number,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; data?: UploadVideoResponse; error?: string }> {
  try {
    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB por chunk
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
    
    console.log(`📦 Arquivo grande detectado: ${(fileSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`📦 Usando upload direto otimizado (chunks serão implementados no backend futuramente)`);

    // Para arquivos grandes, usar upload direto mas com progresso melhorado
    onProgress?.(10); // Iniciando...
    
    console.log('📡 Fazendo upload direto de arquivo grande...');
    
    const uploadResult = await FileSystem.uploadAsync(
      `${BASE_URL}/videos/upload?userId=${userId}`,
      fileUri,
      {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
      }
    );

    onProgress?.(100);

    if (uploadResult.status === 200) {
      const data: UploadVideoResponse = JSON.parse(uploadResult.body);
      
      console.log('🎉 Upload de arquivo grande concluído!');
      
      // Enviar notificação de sucesso
      const fileName = fileUri.split('/').pop() || 'video.mp4';
      const wasBackground = AppState.currentState !== 'active';
      await notificationService.sendUploadCompleteNotification(fileName, wasBackground);
      
      if (data.conquistouStreak) {
        router.push('/(stacks)/progress/streak');
      }
      
      return { success: true, data };
    } else {
      let errorMessage = 'Erro no upload de arquivo grande';
      try {
        const errorData = JSON.parse(uploadResult.body);
        errorMessage = errorData.error || errorMessage;
      } catch {}
      
      return { success: false, error: errorMessage };
    }

  } catch (error) {
    console.error('❌ Erro no upload de arquivo grande:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro no upload de arquivo grande';
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
      timeout: 180000, // 3 minutos para buscar vídeos (servidor pode estar processando uploads grandes)
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
