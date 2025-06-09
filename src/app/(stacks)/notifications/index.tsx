import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../../hooks/useNotifications';
import { PushNotification } from '../../../types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { width } = Dimensions.get('window');

const NotificationItem = ({ 
  item, 
  onPress, 
  onDelete 
}: { 
  item: PushNotification; 
  onPress: () => void;
  onDelete: () => void;
}) => {
  const getIcon = () => {
    switch (item.type) {
      case 'recommendation':
        return 'bulb-outline';
      case 'streak':
        return 'flame-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getIconColor = () => {
    switch (item.type) {
      case 'recommendation':
        return '#3B82F6';
      case 'streak':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const timeAgo = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mx-4 mb-3 rounded-2xl p-4 shadow-sm ${
        item.read ? 'bg-gray-50' : 'bg-white border-l-4 border-blue-500'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${getIconColor()}20` }}
          >
            <Ionicons name={getIcon()} size={20} color={getIconColor()} />
          </View>
          
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className={`text-lg font-semibold ${item.read ? 'text-gray-600' : 'text-gray-900'}`}>
                {item.title}
              </Text>
              {!item.read && (
                <View className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
              )}
            </View>
            
            <Text className={`text-sm mb-2 ${item.read ? 'text-gray-500' : 'text-gray-700'}`}>
              {item.body}
            </Text>
            
            <Text className="text-xs text-gray-400">
              {timeAgo}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onDelete}
          className="ml-2 p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => (
  <View className="flex-1 items-center justify-center px-8">
    <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
      <Ionicons name="notifications-outline" size={40} color="#9CA3AF" />
    </View>
    <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
      Nenhuma notificação ainda
    </Text>
    <Text className="text-base text-gray-500 text-center leading-6">
      Quando você receber recomendações ou alcançar marcos, elas aparecerão aqui
    </Text>
  </View>
);

const FilterTabs = ({ 
  selectedFilter, 
  onFilterChange 
}: { 
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}) => {
  const filters = [
    { key: 'all', label: 'Todas', icon: 'apps-outline' },
    { key: 'recommendation', label: 'Recomendações', icon: 'bulb-outline' },
    { key: 'streak', label: 'Streaks', icon: 'flame-outline' },
  ];

  return (
    <View className="flex-row px-4 mb-4">
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          onPress={() => onFilterChange(filter.key)}
          className={`flex-1 flex-row items-center justify-center py-3 mx-1 rounded-xl ${
            selectedFilter === filter.key
              ? 'bg-blue-500'
              : 'bg-gray-100'
          }`}
        >
          <Ionicons
            name={filter.icon}
            size={16}
            color={selectedFilter === filter.key ? 'white' : '#6B7280'}
          />
          <Text
            className={`ml-2 text-sm font-medium ${
              selectedFilter === filter.key ? 'text-white' : 'text-gray-700'
            }`}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular refresh - aqui você poderia buscar notificações do servidor
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleNotificationPress = (notification: PushNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    router.push({
      pathname: '/(stacks)/notifications/[id]',
      params: { id: notification.id }
    });
  };

  const handleDeleteNotification = (notification: PushNotification) => {
    Alert.alert(
      'Excluir Notificação',
      'Tem certeza que deseja excluir esta notificação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteNotification(notification.id),
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      Alert.alert(
        'Marcar todas como lidas',
        `Marcar ${unreadCount} notificações como lidas?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Marcar',
            onPress: markAllAsRead,
          },
        ]
      );
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    return notification.type === selectedFilter;
  });

  const sortedNotifications = filteredNotifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Notificações',
          headerStyle: { backgroundColor: 'transparent' },
          headerBackground: () => (
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
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
          headerRight: () => (
            unreadCount > 0 ? (
              <TouchableOpacity
                onPress={handleMarkAllAsRead}
                className="mr-4"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="text-white font-medium">
                  Marcar todas
                </Text>
              </TouchableOpacity>
            ) : null
          ),
        }}
      />

      <View className="flex-1 bg-gray-50">
       <View className='pt-10'>
       <FilterTabs
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
       </View>

        {sortedNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={sortedNotifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationItem
                item={item}
                onPress={() => handleNotificationPress(item)}
                onDelete={() => handleDeleteNotification(item)}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#3B82F6']}
                tintColor="#3B82F6"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )}

        {unreadCount > 0 && (
          <View className="absolute bottom-6 right-6">
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              className="bg-blue-500 rounded-full px-4 py-2 shadow-lg"
              style={{
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text className="text-white font-medium text-sm">
                {unreadCount} não lidas
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
} 