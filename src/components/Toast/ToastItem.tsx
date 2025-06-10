import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, PanGestureHandler, State } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { ToastMessage, ToastType } from './ToastContext';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  index: number;
}

const getToastConfig = (type: ToastType) => {
  const configs = {
    success: {
      colors: ['#10B981', '#059669', '#047857'],
      icon: 'check-circle',
      shadowColor: '#10B981',
      borderColor: '#34D399',
    },
    error: {
      colors: ['#EF4444', '#DC2626', '#B91C1C'],
      icon: 'error',
      shadowColor: '#EF4444',
      borderColor: '#F87171',
    },
    warning: {
      colors: ['#F59E0B', '#D97706', '#B45309'],
      icon: 'warning',
      shadowColor: '#F59E0B',
      borderColor: '#FBBF24',
    },
    info: {
      colors: ['#3B82F6', '#2563EB', '#1D4ED8'],
      icon: 'info',
      shadowColor: '#3B82F6',
      borderColor: '#60A5FA',
    },
  };
  return configs[type];
};

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, index }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  
  const config = getToastConfig(toast.type);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0 || isPaused || isDismissing) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (toast.duration! / 100));
        if (newProgress <= 0) {
          onDismiss(toast.id);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [toast.duration, toast.id, onDismiss, isPaused, isDismissing]);

  const handleSwipe = (translationX: number) => {
    if (Math.abs(translationX) > screenWidth * 0.3) {
      setIsDismissing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTimeout(() => onDismiss(toast.id), 200);
    } else {
      setTranslateX(0);
    }
  };

  const handlePress = () => {
    if (toast.action) {
      toast.action.onPress();
      onDismiss(toast.id);
    }
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsPaused(!isPaused);
  };

  return (
    <MotiView
      from={{
        opacity: 0,
        translateY: -100,
        scale: 0.8,
        rotateX: '45deg',
      }}
      animate={{
        opacity: isDismissing ? 0 : 1,
        translateY: isDismissing ? -100 : 0,
        scale: isDismissing ? 0.8 : 1,
        rotateX: '0deg',
        translateX: translateX,
      }}
      exit={{
        opacity: 0,
        translateY: -100,
        scale: 0.6,
        rotateX: '45deg',
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      }}
      style={{
        position: 'absolute',
        top: 60 + (index * 120),
        left: 16,
        right: 16,
        zIndex: 1000 - index,
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.95}
        style={{
          shadowColor: config.shadowColor,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 16,
        }}
      >
        <LinearGradient
          colors={config.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: config.borderColor + '40',
          }}
        >
          {/* Background com efeito glassmorphism */}
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <View className="flex-row items-center p-4">
              {/* Ícone animado */}
              <MotiView
                from={{ scale: 0, rotate: '180deg' }}
                animate={{ scale: 1, rotate: '0deg' }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 400,
                  delay: 300,
                }}
              >
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-3">
                  <MaterialIcons 
                    name={config.icon as any} 
                    size={24} 
                    color="white" 
                  />
                </View>
              </MotiView>

              {/* Conteúdo */}
              <View className="flex-1">
                <MotiView
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 200 }}
                >
                  <Text className="text-white font-bold text-base mb-1">
                    {toast.title}
                  </Text>
                  {toast.description && (
                    <Text className="text-white/80 text-sm leading-5">
                      {toast.description}
                    </Text>
                  )}
                </MotiView>
              </View>

              {/* Botão de ação ou fechar */}
              <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 400 }}
              >
                {toast.action ? (
                  <TouchableOpacity
                    onPress={handlePress}
                    className="bg-white/20 px-3 py-2 rounded-lg ml-2"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-semibold text-sm">
                      {toast.action.label}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => onDismiss(toast.id)}
                    className="w-8 h-8 rounded-full bg-white/20 items-center justify-center ml-2"
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="close" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </MotiView>
            </View>

            {/* Barra de progresso */}
            {toast.duration && toast.duration > 0 && (
              <View className="h-1 bg-white/20">
                <MotiView
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    type: 'timing',
                    duration: 100,
                  }}
                  style={{
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    shadowColor: 'white',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                  }}
                />
              </View>
            )}
          </View>

          {/* Efeito de brilho animado */}
          <MotiView
            from={{ translateX: -screenWidth }}
            animate={{ translateX: screenWidth }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
              repeatReverse: false,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transform: [{ skewX: '-20deg' }],
            }}
          />
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
}; 