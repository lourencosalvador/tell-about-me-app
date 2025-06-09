import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import NotificationIcon from '../svg/notification-icon';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationButtonProps {
  onPress?: () => void;
}

export default function NotificationButton({ onPress }: NotificationButtonProps) {
  const { unreadCount } = useNotifications();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(stacks)/notifications');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-[#1A1A1E] relative flex flex-row gap-3 items-center justify-center rounded-lg h-auto py-3 px-4 z-0"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {unreadCount > 0 && (
        <View className="absolute text-center top-2 left-0 flex items-center justify-center w-6 h-6 z-50 bg-red-500 rounded-full">
          <Text className="text-[12px] font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
      <NotificationIcon className='z-0' />
    </TouchableOpacity>
  );
} 