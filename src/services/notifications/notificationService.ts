import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useNotificationStore } from '../../store/notifications';
import { NotificationType, NotificationData, NotificationPermissions } from '../../types/notifications';

// Configuração do comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Configurar o serviço com o usuário atual
  setUser(userId: string) {
    this.userId = userId;
    console.log(`🔔 NotificationService configurado para usuário: ${userId}`);
  }

  // Registrar para push notifications (opcional)
  async registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('❌ Permissão para notificações negada');
        return null;
      }
      
      // Tentar obter push token, mas não falhar se não conseguir
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        
        if (projectId) {
          token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
          console.log('✅ Push token obtido:', token);
        } else {
          console.log('ℹ️ Project ID não encontrado, continuando apenas com notificações locais');
        }
      } catch (error) {
        console.warn('⚠️ Não foi possível obter push token, continuando apenas com notificações locais:', error);
      }
    } else {
      console.log('ℹ️ Executando no simulador, usando apenas notificações locais');
    }

    this.expoPushToken = token;
    return token;
  }

  // Verificar permissões
  async checkPermissions(): Promise<NotificationPermissions> {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    return { status, canAskAgain };
  }

  // Solicitar permissões
  async requestPermissions(): Promise<NotificationPermissions> {
    const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
    return { status, canAskAgain };
  }

  // Enviar notificação local
  async scheduleLocalNotification(
    title: string,
    body: string,
    type: NotificationType,
    data?: NotificationData,
    delay: number = 0
  ) {
    if (!this.userId) {
      console.warn('❌ Usuário não configurado para notificações');
      return;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type, ...data },
        },
        trigger: delay > 0 ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delay } : null,
      });

      // Adicionar ao store local
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        userId: this.userId,
        title,
        body,
        type,
        data,
        read: false,
      });

      console.log(`🔔 Notificação local agendada: ${notificationId}`);
      return notificationId;
    } catch (error) {
      console.error('❌ Erro ao agendar notificação local:', error);
    }
  }

  // Enviar notificação de recomendação
  async sendRecommendationNotification(recommendation: { area_recomendada: string; justificativa: string }) {
    const title = '🎯 Nova Recomendação Disponível!';
    const body = `Descobrimos uma área perfeita para você: ${recommendation.area_recomendada}`;

    return this.scheduleLocalNotification(
      title,
      body,
      'recommendation',
      {
        recommendation,
        screen: 'recommendations',
      }
    );
  }

  // Enviar notificação de streak
  async sendStreakNotification(currentStreak: number, milestone?: number) {
    const title = milestone 
      ? `🔥 Parabéns! ${milestone} dias consecutivos!`
      : `🔥 Streak de ${currentStreak} dias!`;
      
    const body = milestone
      ? `Você alcançou ${milestone} dias consecutivos de estudo! Continue assim!`
      : `Você está mantendo um streak incrível de ${currentStreak} dias!`;

    return this.scheduleLocalNotification(
      title,
      body,
      'streak',
      {
        streak: { currentStreak, milestone },
        screen: 'profile',
      }
    );
  }

  // Cancelar notificação
  async cancelNotification(notificationId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`🗑️ Notificação cancelada: ${notificationId}`);
    } catch (error) {
      console.error('❌ Erro ao cancelar notificação:', error);
    }
  }

  // Cancelar todas as notificações
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('🗑️ Todas as notificações canceladas');
    } catch (error) {
      console.error('❌ Erro ao cancelar todas as notificações:', error);
    }
  }

  // Obter badge count
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('❌ Erro ao obter badge count:', error);
      return 0;
    }
  }

  // Definir badge count
  async setBadgeCount(count: number) {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.log(`🔢 Badge count definido: ${count}`);
    } catch (error) {
      console.error('❌ Erro ao definir badge count:', error);
    }
  }

  // Limpar badge
  async clearBadge() {
    return this.setBadgeCount(0);
  }

  // Listener para notificações recebidas
  addNotificationReceivedListener(handler: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(handler);
  }

  // Listener para quando o usuário toca na notificação
  addNotificationResponseReceivedListener(handler: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(handler);
  }

  // Obter token de push
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = NotificationService.getInstance(); 