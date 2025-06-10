import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PushNotification, NotificationStore, NotificationType } from '../types/notifications';

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const newNotification: PushNotification = {
          ...notification,
          id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const updatedNotifications = [newNotification, ...state.notifications];
          const unreadCount = updatedNotifications.filter(n => !n.read && n.userId === notification.userId).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });

        console.log(`🔔 Nova notificação adicionada: ${newNotification.title}`);
      },

      markAsRead: (notificationId) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true, readAt: new Date().toISOString() }
              : notification
          );

          const currentUser = state.notifications.find(n => n.id === notificationId)?.userId;
          const unreadCount = currentUser 
            ? updatedNotifications.filter(n => !n.read && n.userId === currentUser).length
            : state.unreadCount;

          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });

        console.log(`📖 Notificação marcada como lida: ${notificationId}`);
      },

      markAllAsRead: () => {
        set((state) => {
          const updatedNotifications = state.notifications.map(notification => ({
            ...notification,
            read: true,
            readAt: notification.readAt || new Date().toISOString(),
          }));

          return {
            notifications: updatedNotifications,
            unreadCount: 0,
          };
        });

        console.log('📖 Todas as notificações marcadas como lidas');
      },

      deleteNotification: (notificationId) => {
        set((state) => {
          const notificationToDelete = state.notifications.find(n => n.id === notificationId);
          const updatedNotifications = state.notifications.filter(n => n.id !== notificationId);
          
          const unreadCount = notificationToDelete && !notificationToDelete.read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount;

          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });

        console.log(`🗑️ Notificação deletada: ${notificationId}`);
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });

        console.log('🗑️ Todas as notificações removidas');
      },

      getNotificationsByType: (type: NotificationType) => {
        const { notifications } = get();
        return notifications.filter(notification => notification.type === type);
      },

      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter(notification => !notification.read);
      },
    }),
    {
      name: 'notifications-storage-fresh',
      storage: createJSONStorage(() => AsyncStorage, {
        reviver: (key, value) => {
          // Recriar objetos Date ao deserializar
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            return new Date(value);
          }
          return value;
        },
        replacer: (key, value) => {
          // Converter Date para string ao serializar
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }
      }),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('✅ Notifications storage rehydrated successfully');
        } else {
          console.warn('⚠️ Notifications storage rehydration failed, using default state');
        }
      },
    }
  )
); 