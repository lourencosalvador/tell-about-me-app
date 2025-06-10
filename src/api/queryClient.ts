import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Não fazer retry em erros 4xx (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          console.log(`🚫 Não fazendo retry para erro ${error.status}`);
          return false;
        }
        
        // Fazer até 3 tentativas para erros de timeout/rede
        if (failureCount < 3) {
          console.log(`🔄 Retry ${failureCount + 1}/3 para:`, error?.message);
          return true;
        }
        
        return false;
      },
      retryDelay: (attemptIndex) => {
        // Delay exponencial: 1s, 3s, 7s
        const delay = Math.min(1000 * Math.pow(2, attemptIndex), 7000);
        console.log(`⏳ Aguardando ${delay}ms antes do próximo retry`);
        return delay;
      },
      staleTime: 1000 * 60 * 2, // 2 minutos - dados ficam "fresh" por mais tempo
      gcTime: 1000 * 60 * 10, // 10 minutos - manter cache por mais tempo
      refetchOnWindowFocus: false, // Não refetch automático ao focar janela
      refetchOnReconnect: true, // Refetch quando reconectar à internet
      refetchOnMount: 'always', // Sempre refetch ao montar componente
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Para mutations, só retry em erros de rede/timeout
        if (error?.message?.includes('Tempo limite') || 
            error?.message?.includes('Failed to fetch') ||
            error?.status === 0) {
          return failureCount < 2; // Máximo 2 tentativas para mutations
        }
        return false;
      },
      retryDelay: 2000, // 2 segundos entre tentativas de mutation
    },
  },
});