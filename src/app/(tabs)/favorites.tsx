import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from '@/src/services/favorites/useFavorites';
import FavoriteButton from '@/src/components/FavoriteButton';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 colunas com padding

export default function FavoritesScreen() {
  const { userFavorites, favoriteCount } = useFavorites();

  const handleVideoPress = (videoUrl: string, transcription?: string) => {
    // Navegar para player de vídeo ou tela de detalhes
    router.push({
      pathname: '/(tabs)/home/video',
      params: { videoUrl, transcription }
    });
  };

  return (
    <View className="flex-1 bg-[#161616]">
      {/* Header */}
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text className="text-white text-xl font-bold flex-1 text-center">
            Meus Favoritos
          </Text>
          
          <View className="w-10" />
        </View>
        
        <Text className="text-white/80 text-center mt-2">
          {favoriteCount} {favoriteCount === 1 ? 'vídeo favorito' : 'vídeos favoritos'}
        </Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {favoriteCount === 0 ? (
          // Estado vazio
          <View className="flex-1 justify-center items-center py-20">
            <MaterialIcons name="favorite-border" size={80} color="#8E8E93" />
            <Text className="text-white text-xl font-semibold mt-4 mb-2">
              Nenhum favorito ainda
            </Text>
            <Text className="text-gray-400 text-center leading-6">
              Toque no ícone de coração nos seus vídeos{'\n'}
              para adicioná-los aos favoritos
            </Text>
            
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/home')}
              className="mt-8"
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-8 py-3 rounded-2xl"
              >
                <Text className="text-white font-semibold">
                  Ver Meus Vídeos
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          // Grid de favoritos
          <View className="flex-row flex-wrap justify-between">
            {userFavorites.map((favorite, index) => (
              <TouchableOpacity
                key={favorite.id}
                onPress={() => handleVideoPress(favorite.videoUrl, favorite.transcription)}
                style={{ 
                  width: cardWidth, 
                  marginBottom: 16,
                  backgroundColor: '#1A1A1E',
                  borderRadius: 12,
                  overflow: 'hidden'
                }}
                activeOpacity={0.8}
              >
                {/* Thumbnail do vídeo */}
                <View style={{ height: 120, backgroundColor: '#2D2D3A' }}>
                  <View className="flex-1 justify-center items-center">
                    <MaterialIcons name="play-circle-filled" size={40} color="#8B5CF6" />
                  </View>
                  
                  {/* Botão de favorito no canto */}
                  <View className="absolute top-2 right-2">
                    <FavoriteButton
                      videoId={favorite.videoId}
                      videoUrl={favorite.videoUrl}
                      transcription={favorite.transcription}
                      size={20}
                    />
                  </View>
                </View>

                {/* Informações */}
                <View className="p-3">
                  <Text className="text-white font-semibold text-sm mb-1">
                    Vídeo #{favorite.videoId.slice(-8)}
                  </Text>
                  
                  <Text className="text-gray-400 text-xs">
                    {new Date(favorite.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                  
                  {favorite.transcription && (
                    <Text className="text-gray-300 text-xs mt-2" numberOfLines={2}>
                      {favorite.transcription}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
} 