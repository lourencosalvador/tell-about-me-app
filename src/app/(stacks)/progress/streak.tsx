import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function StreakScreen() {
  const handleContinue = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-[#2D2D3A] justify-center items-center px-6">
      {/* Elementos decorativos de fundo */}
      <View className="absolute inset-0">
        {/* Arcos coloridos espalhados */}
        <View className="absolute top-20 left-10 w-16 h-8 rounded-full">
          <LinearGradient
            colors={['#FF6B6B', '#4ECDC4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-full"
          />
        </View>
        
        <View className="absolute top-32 right-8 w-20 h-10 rounded-full">
          <LinearGradient
            colors={['#A855F7', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-full"
          />
        </View>
        
        <View className="absolute top-40 left-20 w-12 h-6 rounded-full">
          <LinearGradient
            colors={['#F59E0B', '#EF4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-full"
          />
        </View>
        
        <View className="absolute bottom-40 right-20 w-18 h-9 rounded-full">
          <LinearGradient
            colors={['#8B5CF6', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-full"
          />
        </View>
        
        <View className="absolute bottom-60 left-12 w-14 h-7 rounded-full">
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-full"
          />
        </View>
        
        <View className="absolute bottom-20 right-16 w-16 h-8 rounded-full">
          <LinearGradient
            colors={['#F97316', '#DC2626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-full"
          />
        </View>
      </View>

      {/* Card principal */}
      <View className="bg-white rounded-3xl p-8 w-full max-w-xs mx-auto items-center shadow-2xl">
        {/* Ícone de fogo */}
        <View className="mb-6">
          <LinearGradient
            colors={['#FF6B35', '#F7931E', '#FFD23F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-20 h-20 rounded-full items-center justify-center"
          >
            <MaterialIcons name="local-fire-department" size={48} color="white" />
          </LinearGradient>
        </View>

        {/* Texto principal */}
        <Text className="text-gray-900 text-2xl font-bold text-center mb-2">
          Você Conseguiu um
        </Text>
        <Text className="text-gray-900 text-2xl font-bold text-center mb-6">
          Streak
        </Text>

        {/* Texto explicativo */}
        <Text className="text-gray-600 text-sm text-center mb-8 leading-5">
          Parabéns! Você fez o upload de um vídeo hoje e conquistou um novo streak! 
          Continue assim para manter sua sequência diária.
        </Text>
      </View>

      {/* Botão continuar */}
      <TouchableOpacity
        onPress={handleContinue}
        className="mt-12 w-full max-w-xs mx-auto"
      >
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-4 px-8 rounded-2xl"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continuar
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
} 