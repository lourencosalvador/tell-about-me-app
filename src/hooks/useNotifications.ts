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
            router.push('/(tabs)/profile');
            break;
          default:
            router.push('/(stacks)/notifications');
        }
      } else {
        // Navegar para lista de notificações por padrão
        router.push('/(stacks)/notifications');
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
export const useNotificationSender = () => {
  const sendRecommendationNotification = useCallback(
    async (recommendation: { area_recomendada: string; justificativa: string }) => {
      return await notificationService.sendRecommendationNotification(recommendation);
    },
    []
  );

  const sendStreakNotification = useCallback(
    async (currentStreak: number, milestone?: number) => {
      return await notificationService.sendStreakNotification(currentStreak, milestone);
    },
    []
  );

  return {
    sendRecommendationNotification,
    sendStreakNotification,
  };
};

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