import { useFavoritesStore } from '@/src/store/favorites';
import { useAuthStore } from '@/src/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Hook para gerenciar favoritos de um usuário específico
export const useFavorites = () => {
  const { user } = useAuthStore();
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getUserFavorites,
    clearUserFavorites,
    getFavoriteCount
  } = useFavoritesStore();

  const userId = user?.id || '';

  return {
    // Dados
    allFavorites: favorites,
    userFavorites: getUserFavorites(userId),
    favoriteCount: getFavoriteCount(userId),

    // Actions
    addToFavorites: (videoId: string, videoUrl: string, transcription?: string) => {
      if (!userId) {
        console.warn('⚠️ Usuário não encontrado para adicionar favorito');
        return;
      }
      addFavorite(userId, videoId, videoUrl, transcription);
    },

    removeFromFavorites: (videoId: string) => {
      if (!userId) {
        console.warn('⚠️ Usuário não encontrado para remover favorito');
        return;
      }
      removeFavorite(userId, videoId);
    },

    isVideoFavorite: (videoId: string) => {
      if (!userId) return false;
      return isFavorite(userId, videoId);
    },

    clearAllFavorites: () => {
      if (!userId) {
        console.warn('⚠️ Usuário não encontrado para limpar favoritos');
        return;
      }
      clearUserFavorites(userId);
    },

    // Toggle favorito
    toggleFavorite: (videoId: string, videoUrl: string, transcription?: string) => {
      if (!userId) {
        console.warn('⚠️ Usuário não encontrado para toggle favorito');
        return;
      }

      if (isFavorite(userId, videoId)) {
        removeFavorite(userId, videoId);
        return false; // Removeu dos favoritos
      } else {
        addFavorite(userId, videoId, videoUrl, transcription);
        return true; // Adicionou aos favoritos
      }
    }
  };
};

// Hook com mutações otimizadas para React Query
export const useFavoriteMutation = () => {
  const queryClient = useQueryClient();
  const { toggleFavorite } = useFavorites();

  return useMutation({
    mutationFn: async ({ 
      videoId, 
      videoUrl, 
      transcription 
    }: { 
      videoId: string; 
      videoUrl: string; 
      transcription?: string; 
    }) => {
      const wasAdded = toggleFavorite(videoId, videoUrl, transcription);
      return { videoId, wasAdded };
    },
    onSuccess: (result) => {
      console.log(
        result.wasAdded 
          ? `❤️ Vídeo ${result.videoId} adicionado aos favoritos`
          : `💔 Vídeo ${result.videoId} removido dos favoritos`
      );
      
      // Invalidar queries relacionadas se necessário
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('❌ Erro ao alterar favorito:', error);
    },
  });
};

// Hook para verificar se um vídeo é favorito (otimizado)
export const useIsFavorite = (videoId: string) => {
  const { isVideoFavorite } = useFavorites();
  return isVideoFavorite(videoId);
}; 