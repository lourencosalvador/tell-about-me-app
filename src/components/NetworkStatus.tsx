import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { testServerConnectivity } from '@/src/services/connectivity/connectivity';
import { useToastHelpers } from '@/src/hooks/useToastHelpers';

interface NetworkStatusProps {
  onRetry?: () => void;
}

export default function NetworkStatus({ onRetry }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastHelpers();

  const checkConnectivity = async () => {
    setIsChecking(true);
    try {
      const result = await testServerConnectivity();
      setIsOnline(result.isConnected);
      setLastCheck(new Date());
      
      if (result.isConnected) {
        console.log(`✅ Conectividade OK (${result.responseTime}ms)`);
      } else {
        console.log(`❌ Problemas de conectividade: ${result.error}`);
      }
    } catch (error) {
      setIsOnline(false);
      setLastCheck(new Date());
      console.log('❌ Erro ao testar conectividade:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetryAll = async () => {
    await checkConnectivity();
    
    if (isOnline) {
      // Invalidar todas as queries para refetch
      queryClient.invalidateQueries();
      onRetry?.();
      
      showSuccess("Reconectado! ✅", "Dados atualizados com sucesso.");
    } else {
      showError("Ainda sem conexão ❌", "Verifique sua internet e tente novamente.");
    }
  };

  useEffect(() => {
    // Verificar conectividade na inicialização
    checkConnectivity();

    // Verificar periodicamente (a cada 30 segundos se offline)
    const interval = setInterval(() => {
      if (!isOnline) {
        checkConnectivity();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline]);

  // Não mostrar nada se estiver online
  if (isOnline) return null;

  return (
    <View className="bg-red-500/90 p-3 mx-4 my-2 rounded-xl flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        <MaterialIcons name="wifi-off" size={20} color="white" />
        <View className="ml-3 flex-1">
          <Text className="text-white font-semibold text-sm">
            Problemas de Conexão
          </Text>
          <Text className="text-white/80 text-xs">
            {lastCheck ? `Última verificação: ${lastCheck.toLocaleTimeString()}` : 'Verificando...'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleRetryAll}
        disabled={isChecking}
        className="bg-white/20 px-3 py-2 rounded-lg flex-row items-center"
        activeOpacity={0.7}
      >
        <MaterialIcons 
          name={isChecking ? "hourglass-empty" : "refresh"} 
          size={16} 
          color="white" 
        />
        <Text className="text-white text-xs font-semibold ml-1">
          {isChecking ? "Testando..." : "Tentar Novamente"}
        </Text>
      </TouchableOpacity>
    </View>
  );
} 