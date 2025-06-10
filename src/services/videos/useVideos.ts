import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadVideo, getUserVideos, deleteVideo } from './videos';
import { UserVideo } from '@/src/types';
import { router } from 'expo-router';

const VIDEOS_QUERY_KEY = 'videos';

// Hook para buscar vídeos do usuário
export const useUserVideos = (userId: string) => {
  return useQuery({
    queryKey: [VIDEOS_QUERY_KEY, userId],
    queryFn: async () => {
      console.log('🔍 Buscando vídeos para usuário:', userId);
      const response = await getUserVideos(userId);
      console.log('📹 Vídeos recebidos:', response.videos);
      response.videos.forEach((video, index) => {
        console.log(`📹 Vídeo ${index + 1}:`, {
          id: video.id,
          url: video.url,
          hasUrl: !!video.url
        });
      });
      return response.videos;
    },
    enabled: !!userId, // Só executa se tiver userId
    staleTime: 1000 * 60 * 3, // 3 minutos - vídeos não mudam frequentemente
    gcTime: 1000 * 60 * 15, // 15 minutos - manter cache por mais tempo
    retry: (failureCount, error: any) => {
      // Retry mais específico para timeout
      if (error?.message?.includes('Tempo limite')) {
        console.log('⏰ Timeout na busca de vídeos - fazendo retry');
        return failureCount < 2; // Até 2 tentativas para timeout
      }
      // Para outros erros, usar configuração padrão
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Delay maior para vídeos já que podem ser requisições pesadas
      return Math.min(2000 * Math.pow(1.5, attemptIndex), 10000); // 2s, 3s, 4.5s, max 10s
    },
  });
};

// Hook para upload de vídeo
export const useUploadVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadVideo,
    onSuccess: (result, variables) => {
      console.log('✅ Upload realizado com sucesso:', result);
      
      // Se conquistou streak, apenas loggar (navegação é feita pelo useStreakNavigation)
      if (result.success && result.data?.conquistouStreak) {
        console.log('🔥 Streak conquistado! A navegação será feita automaticamente.');
        
        // Forçar refetch do streak para atualizar imediatamente
        queryClient.invalidateQueries({ queryKey: ['userStreak'] });
      }
      
      // Invalidar e refetch a lista de vídeos do usuário
      queryClient.invalidateQueries({ 
        queryKey: [VIDEOS_QUERY_KEY, variables.userId] 
      });
    },
    onError: (error) => {
      console.error('❌ Erro no upload:', error);
    },
  });
};

// Hook para deletar vídeo
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVideo,
    onMutate: async (videoId) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: [VIDEOS_QUERY_KEY] });

      // Snapshot do estado anterior
      const previousVideos = queryClient.getQueriesData({ 
        queryKey: [VIDEOS_QUERY_KEY] 
      });

      // Atualização otimista - remove o vídeo imediatamente da UI
      queryClient.setQueriesData(
        { queryKey: [VIDEOS_QUERY_KEY] }, 
        (old: UserVideo[] | undefined) => {
          return old?.filter(video => video.id !== videoId) || [];
        }
      );

      return { previousVideos };
    },
    onError: (error, videoId, context) => {
      // Reverter em caso de erro
      if (context?.previousVideos) {
        context.previousVideos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Erro ao deletar vídeo:', error);
    },
    onSettled: () => {
      // Sempre refetch após completar
      queryClient.invalidateQueries({ queryKey: [VIDEOS_QUERY_KEY] });
    },
  });
};

// Hook para transcrição de áudio
export const useAudioTranscription = () => {
  return useMutation({
    mutationFn: async (audioFile: File) => {
      // Esta função precisa ser implementada no novo service
      throw new Error('Função de transcrição ainda não implementada');
    },
    onError: (error) => {
      console.error('Erro na transcrição:', error);
    },
  });
};