import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useToastHelpers } from '@/src/hooks/useToastHelpers';
import { MotiView, AnimatePresence } from 'moti';
import { router } from 'expo-router';

export default function ToastDemoScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPersistent,
    showUploadSuccess,
    showUploadError,
    showNetworkError,
    showVideoDeleted,
    showFavoriteAdded,
    showFavoriteRemoved,
    showStreakAchieved,
    showRecommendationReady,
  } = useToastHelpers();

  const demoButtons = [
    {
      title: 'Toast de Sucesso',
      subtitle: 'Mensagem de operação bem-sucedida',
      color: ['#10B981', '#059669'],
      icon: 'check-circle',
      onPress: () => showSuccess('Operação Concluída!', 'Tudo funcionou perfeitamente como esperado.'),
    },
    {
      title: 'Toast de Erro',
      subtitle: 'Mensagem de erro crítico',
      color: ['#EF4444', '#DC2626'],
      icon: 'error',
      onPress: () => showError('Algo deu errado!', 'Ocorreu um erro inesperado. Tente novamente.', {
        label: 'Retry',
        onPress: () => console.log('Retry clicado!'),
      }),
    },
    {
      title: 'Toast de Aviso',
      subtitle: 'Mensagem de alerta importante',
      color: ['#F59E0B', '#D97706'],
      icon: 'warning',
      onPress: () => showWarning('Atenção necessária', 'Esta ação pode ter consequências importantes.'),
    },
    {
      title: 'Toast Informativo',
      subtitle: 'Informação geral para o usuário',
      color: ['#3B82F6', '#2563EB'],
      icon: 'info',
      onPress: () => showInfo('Nova funcionalidade!', 'Descobrimos algo interessante para você.'),
    },
    {
      title: 'Toast Persistente',
      subtitle: 'Fica na tela até ser fechado',
      color: ['#8B5CF6', '#7C3AED'],
      icon: 'push-pin',
      onPress: () => showPersistent('warning', 'Mensagem Importante', 'Esta mensagem não desaparecerá automaticamente.'),
    },
    {
      title: 'Upload Sucesso',
      subtitle: 'Feedback de upload concluído',
      color: ['#10B981', '#047857'],
      icon: 'cloud-upload',
      onPress: () => showUploadSuccess('video_exemplo.mp4'),
    },
    {
      title: 'Upload Erro',
      subtitle: 'Feedback de falha no upload',
      color: ['#EF4444', '#B91C1C'],
      icon: 'cloud-off',
      onPress: () => showUploadError('Conexão perdida durante o upload'),
    },
    {
      title: 'Erro de Rede',
      subtitle: 'Problema de conectividade',
      color: ['#EF4444', '#DC2626'],
      icon: 'wifi-off',
      onPress: () => showNetworkError(),
    },
    {
      title: 'Vídeo Deletado',
      subtitle: 'Confirmação de exclusão',
      color: ['#10B981', '#059669'],
      icon: 'delete',
      onPress: () => showVideoDeleted(),
    },
    {
      title: 'Favorito Adicionado',
      subtitle: 'Item salvo nos favoritos',
      color: ['#EF4444', '#DC2626'],
      icon: 'favorite',
      onPress: () => showFavoriteAdded(),
    },
    {
      title: 'Favorito Removido',
      subtitle: 'Item removido dos favoritos',
      color: ['#6B7280', '#4B5563'],
      icon: 'favorite-border',
      onPress: () => showFavoriteRemoved(),
    },
    {
      title: 'Streak Conquistado',
      subtitle: 'Conquista de sequência',
      color: ['#F59E0B', '#D97706'],
      icon: 'local-fire-department',
      onPress: () => showStreakAchieved(7),
    },
    {
      title: 'Nova Recomendação',
      subtitle: 'Sugestão personalizada disponível',
      color: ['#3B82F6', '#1D4ED8'],
      icon: 'lightbulb',
      onPress: () => showRecommendationReady(),
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="flex-1 bg-[#161616]"
        >
          {/* Header */}
          <MotiView
            from={{ translateY: -50, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ delay: 200 }}
            className="pt-16 pb-6 px-6"
          >
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              
              <Text className="text-white text-xl font-bold">Demo de Toasts</Text>
              
              <View className="w-10" />
            </View>
            
            <Text className="text-white/70 text-center">
              Toque nos cards abaixo para ver os diferentes tipos de toast em ação! 🎉
            </Text>
          </MotiView>

          {/* Grid de Demos */}
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="flex-row flex-wrap justify-between">
              {demoButtons.map((button, index) => (
                <MotiView
                  key={button.title}
                  from={{ opacity: 0, translateY: 50, scale: 0.8 }}
                  animate={{ opacity: 1, translateY: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                    delay: 300 + (index * 100),
                  }}
                  className="w-[48%] mb-4"
                >
                  <TouchableOpacity
                    onPress={button.onPress}
                    activeOpacity={0.8}
                    style={{
                      shadowColor: button.color[0],
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.3,
                      shadowRadius: 16,
                      elevation: 12,
                    }}
                  >
                    <LinearGradient
                      colors={[button.color[0], button.color[1], button.color[1] + '80']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="rounded-2xl p-4 min-h-[120px] justify-center items-center"
                    >
                      <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center mb-3">
                        <MaterialIcons 
                          name={button.icon as any} 
                          size={24} 
                          color="white" 
                        />
                      </View>
                      
                      <Text className="text-white font-bold text-sm text-center mb-1">
                        {button.title}
                      </Text>
                      
                      <Text className="text-white/80 text-xs text-center leading-4">
                        {button.subtitle}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>

            {/* Instruções */}
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 1500 }}
              className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10"
            >
              <View className="flex-row items-center mb-3">
                <MaterialIcons name="tips-and-updates" size={24} color="#F59E0B" />
                <Text className="text-white font-bold text-lg ml-2">Dicas de Interação</Text>
              </View>
              
              <Text className="text-white/80 text-sm leading-6">
                • <Text className="font-semibold">Toque</Text> para testar o toast{'\n'}
                • <Text className="font-semibold">Pressione e segure</Text> um toast para pausar{'\n'}
                • <Text className="font-semibold">Deslize</Text> para descartar rapidamente{'\n'}
                • <Text className="font-semibold">Toque no X</Text> para fechar manualmente
              </Text>
            </MotiView>
          </ScrollView>
        </MotiView>
      )}
    </AnimatePresence>
  );
} 