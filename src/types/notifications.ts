export interface PushNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: NotificationData;
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export type NotificationType = 'recommendation' | 'streak' | 'general';

export interface NotificationData {
  // Para recomendações
  recommendation?: {
    area_recomendada: string;
    justificativa: string;
  };
  
  // Para streak
  streak?: {
    currentStreak: number;
    milestone?: number;
  };
  
  // Dados gerais para navegação
  screen?: string;
  params?: Record<string, any>;
}

export interface NotificationStore {
  notifications: PushNotification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<PushNotification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: NotificationType) => PushNotification[];
  getUnreadNotifications: () => PushNotification[];
}

export interface ExpoNotificationRequest {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: any;
  sound?: 'default' | null;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
  ttl?: number;
}

export interface NotificationPermissions {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain: boolean;
} 