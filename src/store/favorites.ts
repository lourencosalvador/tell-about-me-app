import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteVideo {
  id: string;
  userId: string;
  videoId: string;
  videoUrl: string;
  createdAt: string;
  // Dados extras do vídeo para exibição
  transcription?: string;
}

interface FavoritesState {
  favorites: FavoriteVideo[];
  
  // Actions
  addFavorite: (userId: string, videoId: string, videoUrl: string, transcription?: string) => void;
  removeFavorite: (userId: string, videoId: string) => void;
  isFavorite: (userId: string, videoId: string) => boolean;
  getUserFavorites: (userId: string) => FavoriteVideo[];
  clearUserFavorites: (userId: string) => void;
  getFavoriteCount: (userId: string) => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (userId: string, videoId: string, videoUrl: string, transcription?: string) => {
        const existingFavorite = get().favorites.find(
          fav => fav.userId === userId && fav.videoId === videoId
        );

        if (existingFavorite) {
          console.log('📌 Vídeo já está nos favoritos');
          return;
        }

        const newFavorite: FavoriteVideo = {
          id: `${userId}_${videoId}_${Date.now()}`,
          userId,
          videoId,
          videoUrl,
          transcription,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          favorites: [...state.favorites, newFavorite]
        }));

        console.log('❤️ Vídeo adicionado aos favoritos:', videoId);
      },

      removeFavorite: (userId: string, videoId: string) => {
        set(state => ({
          favorites: state.favorites.filter(
            fav => !(fav.userId === userId && fav.videoId === videoId)
          )
        }));

        console.log('💔 Vídeo removido dos favoritos:', videoId);
      },

      isFavorite: (userId: string, videoId: string) => {
        return get().favorites.some(
          fav => fav.userId === userId && fav.videoId === videoId
        );
      },

      getUserFavorites: (userId: string) => {
        return get().favorites.filter(fav => fav.userId === userId);
      },

      clearUserFavorites: (userId: string) => {
        set(state => ({
          favorites: state.favorites.filter(fav => fav.userId !== userId)
        }));

        console.log('🗑️ Favoritos do usuário limpos:', userId);
      },

      getFavoriteCount: (userId: string) => {
        return get().favorites.filter(fav => fav.userId === userId).length;
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Particionar por versão para evitar problemas de compatibilidade
      version: 1,
    }
  )
); 