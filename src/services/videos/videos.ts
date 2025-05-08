// services/videos.ts
import api from '@/src/api/client';
import { UserVideo } from '@/src/types';

import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';


interface UploadVideoResponse {
  audioId?: string; // ou videoId, dependendo do seu backend
  error?: string;
}

const uploadVideo = async (userId: string, fileUri: string) => {
  if (!userId) throw new Error('ID de usuário é obrigatório');
  if (!fileUri) throw new Error('URI do arquivo é obrigatório');
  
  const formData = new FormData();
  formData.append('video', {
    name: `video-movile-upload`,
    type: 'video/mp4',
    uri: fileUri,
  } as any);

  const url = `https://eeee870cb1e3155aa51b1bc56bae6d24.serveo.net/videos/upload?userId=${userId}`;

  try {
    console.log("🔧 Iniciando upload com FormData", formData);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error(`❗Erro na resposta do servidor: ${response.status} ${response.statusText}`);
      return { success: false, error: `Erro ${response.status}` };
    }
    
    const text = await response.text();
    if (!text.trim()) {
      console.error('❗Resposta vazia do servidor');
      return { success: false, error: 'Resposta vazia' };
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.error('❗Erro ao analisar resposta JSON:', parseError, 'Texto recebido:', text);
      return { success: false, error: 'Erro ao analisar resposta' };
    }
  } catch (error) {
    console.error('❗Erro ao fazer upload do vídeo:', error);
    return { success: false, error: String(error) };
  }
};


export const getVideosByUser = async (userId: string): Promise<UserVideo[]> => {
  try {

    if (!userId) {
      console.log('user id nao existe')
    }

    const response = await api<{ videos: UserVideo[] }>(`users/${userId}/videos`, {
      method: 'GET',
    });
    

    return response.videos;
  } catch (error) {
    console.error('Erro ao pegar os videos:', error);
    throw error;
  }

};

export const sendAudioForTranscription = async (audioUri: string): Promise<{ transcription: string }> => {
  try {
    // 1. Validação básica do input
    if (!audioUri) {
      throw new Error('URI do áudio não fornecida');
    }

    // 2. Verificar se o arquivo existe localmente
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) {
      throw new Error('Arquivo de áudio não encontrado');
    }

    // 3. Ler o arquivo como base64
    const audioData = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 4. Enviar para o servidor
    const response = await api<{ transcription: string }>('audio/transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/wav',
      },
      body: audioData,
    });

    // 5. Retornar dados formatados
    return {
      transcription: response.transcription
    };

  } catch (error: any) {
    console.error('Erro na transcrição de áudio:', error);
    
    // Adiciona informações contextuais ao erro
    const enhancedError = new Error(`Falha na transcrição: ${error.message}`);
    enhancedError.stack = error.stack;
    
    throw enhancedError;
  }
};

export const ServiceVideos = {
  getVideosByUser,
  sendAudioForTranscription,
  uploadVideo
};
