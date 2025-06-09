import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFavorite, useFavoriteMutation } from '@/src/services/favorites/useFavorites';

interface FavoriteButtonProps {
  videoId: string;
  videoUrl: string;
  transcription?: string;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  onToggle?: (isFavorite: boolean) => void;
  disabled?: boolean;
}

export default function FavoriteButton({
  videoId,
  videoUrl,
  transcription,
  size = 24,
  activeColor = '#FF4757',
  inactiveColor = '#8E8E93',
  onToggle,
  disabled = false
}: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(videoId);
  const favoriteMutation = useFavoriteMutation();

  const handlePress = async () => {
    if (disabled || favoriteMutation.isPending) return;

    try {
      const result = await favoriteMutation.mutateAsync({
        videoId,
        videoUrl,
        transcription
      });

      onToggle?.(result.wasAdded);
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || favoriteMutation.isPending}
      style={{
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.1)',
        opacity: disabled ? 0.5 : 1,
      }}
      activeOpacity={0.7}
    >
      {favoriteMutation.isPending ? (
        <ActivityIndicator size="small" color={activeColor} />
      ) : (
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={size}
          color={isFavorite ? activeColor : inactiveColor}
        />
      )}
    </TouchableOpacity>
  );
} 