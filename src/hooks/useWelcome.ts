import { useEffect } from 'react';
import { useAuthStore } from '@/src/store/user';
import { useNotificationSender } from './useNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useWelcome() {
  const { user } = useAuthStore();
  const { sendWelcomeNotification } = useNotificationSender();

  useEffect(() => {
    if (!user?.id) return;

    const checkFirstTime = async () => {
      try {
        const hasSeenWelcome = await AsyncStorage.getItem(`welcome_seen_${user.id}`);
        
        if (!hasSeenWelcome) {
          // Primeiro acesso! Enviar notificação de boas-vindas
          await sendWelcomeNotification({
            userName: user.name,
            userId: user.id,
          });

          // Marcar como visto
          await AsyncStorage.setItem(`welcome_seen_${user.id}`, 'true');
        }
      } catch (error) {
        console.error('Erro ao verificar primeiro acesso:', error);
      }
    };

    // Aguardar um pouco para garantir que o app esteja totalmente carregado
    const timer = setTimeout(checkFirstTime, 2000);
    
    return () => clearTimeout(timer);
  }, [user?.id]);

  return null;
} 