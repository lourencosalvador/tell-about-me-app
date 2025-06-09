import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserStreak, updateUserProfile, uploadProfilePhoto } from './user';
import { useAuthStore } from '@/src/store/user';
import { router } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationSender } from '../../hooks/useNotifications';

interface StreakData {
  streak: number;
  streakConquistadoHoje: boolean;
  lastStreakDate: string | null;
}

interface UserProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    class: string;
    photoUrl: string;
    recommendation: string | null;
    streak: number;
  };
  message: string;
}

interface PhotoUploadResponse {
  user: {
    id: string;
    name: string;
    email: string;
    class: string;
    photoUrl: string;
    recommendation: string | null;
    streak: number;
  };
  photoUrl: string;
  message: string;
}

// Hook para verificar streak atual
export const useCheckStreak = () => {
  const { user, updateUser } = useAuthStore();
  
  return useQuery({
    queryKey: ['userStreak', user?.id],
    queryFn: async (): Promise<StreakData | null> => {
      if (!user?.id) return null;
      
      const streakData = await getUserStreak(user.id) as StreakData;
      console.log('🔥 Dados do streak:', streakData);
      
      // Atualizar o streak no store do usuário
      updateUser({ ...user, streak: streakData.streak });
      
      return streakData;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutos de cache
    refetchOnWindowFocus: true, // Refetch quando voltar para o app
    refetchOnMount: true, // Refetch quando componente montar
  });
};

// Hook para verificar se deve mostrar tela de streak
export const useStreakNavigation = () => {
  const { user } = useAuthStore();
  const { data: streakData } = useCheckStreak();
  const { sendStreakNotification } = useNotificationSender();

  useEffect(() => {
    const checkAndNavigateStreak = async () => {
      if (!streakData || !user?.id) return;

      // Chave única para cada streak conquistado
      const streakKey = `streak_shown_${user.id}_${streakData.streak}`;
      const streakAlreadyShown = await AsyncStorage.getItem(streakKey);

      // Se conquistou streak hoje E ainda não mostrou a tela para este streak
      if (streakData.streakConquistadoHoje && !streakAlreadyShown) {
        console.log('🔥 NAVEGANDO PARA TELA DE STREAK! Streak:', streakData.streak);
        
        // Marcar como já mostrado
        await AsyncStorage.setItem(streakKey, 'true');
        
        // Enviar notificação de streak
        try {
          const milestone = streakData.streak % 7 === 0 && streakData.streak > 0 ? streakData.streak : undefined;
          await sendStreakNotification(streakData.streak, milestone);
          console.log('🔔 Notificação de streak enviada');
        } catch (error) {
          console.error('❌ Erro ao enviar notificação de streak:', error);
        }
        
        // Navegar para tela de streak
        router.push('/(stacks)/progress/streak');
      }
    };

    checkAndNavigateStreak();
  }, [streakData, user?.id, sendStreakNotification]);

  return streakData;
};

// Hook para atualizar perfil
export const useUpdateProfile = () => {
  const { user, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { name?: string; photoUrl?: string }): Promise<UserProfileResponse> => {
      if (!user?.id) throw new Error('Usuário não encontrado');
      
      const response = await updateUserProfile(user.id, data) as UserProfileResponse;
      return response;
    },
    onSuccess: (response: UserProfileResponse) => {
      // Atualizar o store local com os novos dados
      updateUser(response.user);
      console.log('✅ Perfil atualizado:', response.user);
    },
    onError: (error) => {
      console.error('❌ Erro ao atualizar perfil:', error);
    },
  });
};

// Hook para upload de foto de perfil
export const useUploadProfilePhoto = () => {
  const { user, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (imageUri: string): Promise<PhotoUploadResponse> => {
      if (!user?.id) throw new Error('Usuário não encontrado');
      
      const response = await uploadProfilePhoto(user.id, imageUri) as PhotoUploadResponse;
      return response;
    },
    onSuccess: (response: PhotoUploadResponse) => {
      // Atualizar o store local com a nova foto
      updateUser(response.user);
      console.log('📸 Foto de perfil atualizada:', response.photoUrl);
    },
    onError: (error) => {
      console.error('❌ Erro ao fazer upload da foto:', error);
    },
  });
}; 