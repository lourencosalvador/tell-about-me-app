import { useEffect, useCallback } from 'react';
import { useNotificationStore } from '../store/notifications';
import { notificationService } from '../services/notifications/notificationService';
import { useAuthStore } from '../store/user';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useQueryClient } from '@tanstack/react-query';

// Hook principal para gerenciar notificações
export const useNotifications = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotificationStore();

  // Filtrar notificações do usuário atual
  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const userUnreadCount = userNotifications.filter(n => !n.read).length;

  // Configurar o serviço de notificações quando o usuário loggar
  useEffect(() => {
    if (user?.id && queryClient) {
      notificationService.setUser(user.id);
      notificationService.registerForPushNotificationsAsync();
    }
  }, [user?.id, queryClient]);

  // Listener para navegação quando usuário toca na notificação
  useEffect(() => {
    if (!user?.id) return;

    const subscription = notificationService.addNotificationResponseReceivedListener(response => {
      const { data, type } = response.notification.request.content.data || {};
      
      console.log('🔔 Usuário tocou na notificação:', { type, data });

      // Navegar para a tela específica baseado no tipo
      if (data?.screen) {
        switch (data.screen) {
          case 'recommendations':
            router.push('/(tabs)/home');
            break;
          case 'profile':
            router.push('/(tabs)/profile' as any);
            break;
          default:
            router.push('/(stacks)/notifications' as any);
        }
      } else {
        // Navegar para lista de notificações por padrão
        router.push('/(stacks)/notifications' as any);
      }
    });

    return () => subscription.remove();
  }, [user?.id]);

  // Atualizar badge do app
  useEffect(() => {
    if (user?.id) {
      notificationService.setBadgeCount(userUnreadCount);
    }
  }, [userUnreadCount, user?.id]);

  return {
    notifications: userNotifications,
    unreadCount: userUnreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };
};

// Hook para solicitar permissões
export const useNotificationPermissions = () => {
  const requestPermissions = useCallback(async () => {
    const permissions = await notificationService.requestPermissions();
    
    if (permissions.status === 'granted') {
      console.log('✅ Permissões de notificação concedidas');
      return true;
    } else {
      console.warn('❌ Permissões de notificação negadas');
      return false;
    }
  }, []);

  const checkPermissions = useCallback(async () => {
    return await notificationService.checkPermissions();
  }, []);

  return {
    requestPermissions,
    checkPermissions,
  };
};

// Hook para enviar notificações específicas
export function useNotificationSender() {
  // Função para enviar notificação de recomendação
  const sendRecommendationNotification = async (recommendation: {
    area_recomendada: string;
    justificativa: string;
  }) => {
    try {
      const title = '🎯 Nova Recomendação de Carreira!';
      const body = `Recomendamos focar em ${recommendation.area_recomendada}. Toque para ver mais detalhes!`;
      
      const notificationId = await notificationService.scheduleLocalNotification(
        title,
        body,
        'recommendation',
        {
          recommendation: recommendation,
          screen: 'recommendations',
        }
      );

      console.log('✅ Notificação de recomendação enviada:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de recomendação:', error);
    }
  };

  // Função para enviar notificação de streak
  const sendStreakNotification = async (currentStreak: number, milestone?: number) => {
    try {
      const title = milestone 
        ? `🔥 Marco de ${milestone} dias alcançado!`
        : `🔥 ${currentStreak} dias de streak!`;
      
      const body = milestone
        ? `Incrível! Você manteve sua consistência por ${milestone} dias seguidos! Continue assim!`
        : `Você está em uma sequência de ${currentStreak} dias! Mantenha o ritmo!`;

      const notificationId = await notificationService.scheduleLocalNotification(
        title,
        body,
        'streak',
        {
          streak: { currentStreak, milestone },
          screen: 'profile',
        }
      );

      console.log('✅ Notificação de streak enviada:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de streak:', error);
    }
  };

  // Função para enviar notificação de conquista
  const sendAchievementNotification = async (achievement: {
    title: string;
    body: string;
    icon: string;
    streakReward: number;
  }) => {
    try {
      const notificationId = await notificationService.scheduleLocalNotification(
        achievement.title,
        achievement.body,
        'general',
        {
          icon: achievement.icon,
          streakReward: achievement.streakReward,
          screen: 'profile',
        }
      );

      console.log('✅ Notificação de conquista enviada:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de conquista:', error);
    }
  };

  // Função para enviar notificação de desafio
  const sendChallengeNotification = async (challenge: {
    title: string;
    description: string;
    reward: number;
    deadline: Date;
  }) => {
    try {
      const daysLeft = Math.ceil((challenge.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const title = `🎯 Novo Desafio: ${challenge.title}`;
      const body = `${challenge.description} | Recompensa: ${challenge.reward} streaks | ${daysLeft} dias restantes`;
      
      const notificationId = await notificationService.scheduleLocalNotification(
        title,
        body,
        'general',
        {
          challenge: challenge,
          screen: 'profile',
        }
      );

      console.log('✅ Notificação de desafio enviada:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de desafio:', error);
    }
  };

  // Função para enviar notificação de boas-vindas
  const sendWelcomeNotification = async (welcome: {
    userName: string;
    userId: string;
  }) => {
    try {
      // Primeira notificação - Boas vindas
      const welcomeId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🎉 Bem-vindo, ${welcome.userName}! Sua jornada épica começa agora!`,
          body: `🚀 Você está prestes a embarcar numa aventura gamificada única! Prepare-se para conquistar badges, desafios e se tornar uma LENDA! 👑`,
          data: {
            type: 'welcome',
            userId: welcome.userId,
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });

      // Segunda notificação - Sistema de Conquistas (3 segundos depois)
      const achievementsId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🏆 Sistema de Conquistas Ativado!`,
          body: `🎯 Complete missões épicas: Primeiro Vídeo (+3 streaks), Dedicado (+5), Polivalente (+4), Expert (+10), Consistente (+7), Mestre (+15)! Cada conquista te eleva! ⚡`,
          data: {
            type: 'features',
            feature: 'achievements',
            userId: welcome.userId,
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3 },
      });

      // Terceira notificação - Sistema de Desafios (6 segundos depois)
      const challengesId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🎯 Desafios Dinâmicos Liberados!`,
          body: `🔥 Desafios inteligentes são gerados automaticamente: Semana Produtiva, Explorador de Tecnologias, Mestre da Consistência, Maratona de Vídeos e muito mais! Recompensas épicas aguardam! 💎`,
          data: {
            type: 'features',
            feature: 'challenges',
            userId: welcome.userId,
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 6 },
      });

      // Quarta notificação - Sistema de Níveis (9 segundos depois)
      const levelsId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `📈 Sistema de Progressão Ativado!`,
          body: `🌟 Evolua através dos níveis: Iniciante → Júnior → Intermediário → Avançado → Expert → Mestre → LENDA! 👑 Cada nível desbloqueia novos títulos e poderes! ⚡`,
          data: {
            type: 'features',
            feature: 'levels',
            userId: welcome.userId,
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 9 },
      });

      console.log('✅ Sequência de boas-vindas épica enviada:', {
        welcomeId,
        achievementsId,
        challengesId,
        levelsId
      });
      
      return welcomeId;
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de boas-vindas:', error);
    }
  };

  // Função para enviar notificação de upload concluído
  const sendUploadCompleteNotification = async (fileName: string, wasBackground: boolean = false) => {
    try {
      const title = '📹 Upload Concluído!';
      const body = wasBackground 
        ? `Seu vídeo "${fileName}" foi enviado com sucesso enquanto você usava outros apps!`
        : `Seu vídeo "${fileName}" foi enviado com sucesso!`;

      const notificationId = await notificationService.scheduleLocalNotification(
        title,
        body,
        'general',
        {
          uploadComplete: { fileName, wasBackground },
          screen: 'profile',
        }
      );

      console.log('✅ Notificação de upload concluído enviada:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de upload concluído:', error);
    }
  };

  // Função para enviar notificação de erro no upload
  const sendUploadErrorNotification = async (fileName: string, error: string) => {
    try {
      const title = '❌ Erro no Upload';
      const body = `Não foi possível enviar "${fileName}": ${error}`;

      const notificationId = await notificationService.scheduleLocalNotification(
        title,
        body,
        'general',
        {
          uploadError: { fileName, error },
          screen: 'camera',
        }
      );

      console.log('✅ Notificação de erro de upload enviada:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de erro de upload:', error);
    }
  };

  return {
    sendRecommendationNotification,
    sendStreakNotification,
    sendAchievementNotification,
    sendChallengeNotification,
    sendWelcomeNotification,
    sendUploadCompleteNotification,
    sendUploadErrorNotification,
  };
}

// Hook para gerenciar badges
export const useNotificationBadge = () => {
  const setBadgeCount = useCallback(async (count: number) => {
    return await notificationService.setBadgeCount(count);
  }, []);

  const clearBadge = useCallback(async () => {
    return await notificationService.clearBadge();
  }, []);

  const getBadgeCount = useCallback(async () => {
    return await notificationService.getBadgeCount();
  }, []);

  return {
    setBadgeCount,
    clearBadge,
    getBadgeCount,
  };
}; 