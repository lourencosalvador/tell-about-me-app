import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../../hooks/useNotifications';
import { PushNotification } from '../../../types/notifications';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { width } = Dimensions.get('window');

const RecommendationCard = ({ recommendation }: { recommendation: any }) => (
  <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
    <View className="flex-row items-center mb-4">
      <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
        <Ionicons name="bulb" size={24} color="#3B82F6" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">
          Área Recomendada
        </Text>
        <Text className="text-sm text-gray-600">
          Baseado na sua atividade
        </Text>
      </View>
    </View>

    <View className="bg-white rounded-xl p-4 mb-4">
      <Text className="text-xl font-bold text-blue-600 mb-2">
        {recommendation.area_recomendada}
      </Text>
    </View>

    <View className="bg-white rounded-xl p-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        Justificativa:
      </Text>
      <Text className="text-sm text-gray-600 leading-6">
        {recommendation.justificativa}
      </Text>
    </View>

    <TouchableOpacity
      onPress={() => router.push('/(tabs)/home')}
      className="mt-4 bg-blue-500 rounded-xl py-3 px-6 items-center"
    >
      <Text className="text-white font-semibold">
        Ver Recomendações
      </Text>
    </TouchableOpacity>
  </View>
);

const StreakCard = ({ streak }: { streak: any }) => (
  <View className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-6">
    <View className="flex-row items-center mb-4">
      <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-4">
        <Ionicons name="flame" size={24} color="#F59E0B" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">
          Streak Alcançado!
        </Text>
        <Text className="text-sm text-gray-600">
          Continue mantendo o ritmo
        </Text>
      </View>
    </View>

    <View className="bg-white rounded-xl p-4 mb-4">
      <View className="items-center">
        <Text className="text-4xl font-bold text-orange-500 mb-2">
          {streak.currentStreak}
        </Text>
        <Text className="text-lg font-medium text-gray-700">
          dias consecutivos
        </Text>
        {streak.milestone && (
          <View className="mt-3 bg-yellow-100 rounded-full px-4 py-2">
            <Text className="text-yellow-700 font-medium">
              🏆 Marco de {streak.milestone} dias!
            </Text>
          </View>
        )}
      </View>
    </View>

    <TouchableOpacity
      onPress={() => router.navigate('/(tabs)/profile')}
      className="mt-4 bg-orange-500 rounded-xl py-3 px-6 items-center"
    >
      <Text className="text-white font-semibold">
        Ver Progresso
      </Text>
    </TouchableOpacity>
  </View>
);

const NotificationActions = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: {
  notification: PushNotification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}) => (
  <View className="px-6 pb-6">
    <View className="flex-row space-x-3">
      {!notification.read && (
        <TouchableOpacity
          onPress={onMarkAsRead}
          className="flex-1 bg-blue-500 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-semibold">
            Marcar como lida
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        onPress={onDelete}
        className="flex-1 bg-red-500 rounded-xl py-4 items-center"
      >
        <Text className="text-white font-semibold">
          Excluir
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notifications, markAsRead, deleteNotification } = useNotifications();
  const [notification, setNotification] = useState<PushNotification | null>(null);

  useEffect(() => {
    if (id) {
      const foundNotification = notifications.find(n => n.id === id);
      setNotification(foundNotification || null);
      
      // Marcar como lida automaticamente ao abrir
      if (foundNotification && !foundNotification.read) {
        markAsRead(foundNotification.id);
      }
    }
  }, [id, notifications, markAsRead]);

  const handleDelete = () => {
    if (!notification) return;

    Alert.alert(
      'Excluir Notificação',
      'Tem certeza que deseja excluir esta notificação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteNotification(notification.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleMarkAsRead = () => {
    if (notification && !notification.read) {
      markAsRead(notification.id);
    }
  };

  const getIcon = () => {
    switch (notification?.type) {
      case 'recommendation':
        return 'bulb-outline';
      case 'streak':
        return 'flame-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getIconColor = () => {
    switch (notification?.type) {
      case 'recommendation':
        return '#3B82F6';
      case 'streak':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  if (!notification) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Notificação',
          }}
        />
        <View className="flex-1 items-center justify-center bg-gray-50">
          <Text className="text-lg text-gray-500">
            Notificação não encontrada
          </Text>
        </View>
      </>
    );
  }

  const formattedDate = format(new Date(notification.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
    locale: ptBR,
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Detalhes',
          headerStyle: { backgroundColor: 'transparent' },
          headerBackground: () => (
            <LinearGradient
              colors={[getIconColor(), getIconColor() + '80']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          ),
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      />

      <ScrollView className="flex-1 bg-gray-50">
        {/* Header da notificação */}
        <View className="px-6 py-6 bg-white">
          <View className="flex-row items-start">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: `${getIconColor()}20` }}
            >
              <Ionicons name={getIcon()} size={28} color={getIconColor()} />
            </View>
            
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Text className="text-xl font-bold text-gray-900 flex-1">
                  {notification.title}
                </Text>
                {!notification.read && (
                  <View className="w-3 h-3 bg-blue-500 rounded-full ml-2" />
                )}
              </View>
              
              <Text className="text-base text-gray-700 mb-3 leading-6">
                {notification.body}
              </Text>
              
              <Text className="text-sm text-gray-500">
                {formattedDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Conteúdo específico baseado no tipo */}
        <View className="px-6 py-6">
          {notification.type === 'recommendation' && notification.data?.recommendation && (
            <RecommendationCard recommendation={notification.data.recommendation} />
          )}
          
          {notification.type === 'streak' && notification.data?.streak && (
            <StreakCard streak={notification.data.streak} />
          )}
          
          {notification.type === 'general' && (
            <View className="bg-white rounded-2xl p-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Informações Gerais
              </Text>
              <Text className="text-base text-gray-700 leading-6">
                Esta é uma notificação geral do sistema.
              </Text>
            </View>
          )}
        </View>

        {/* Ações */}
        <NotificationActions
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      </ScrollView>
    </>
  );
} 