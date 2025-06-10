import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getRecommendation, 
  generateRecommendation, 
  regenerateRecommendation,
  RecommendationResponse,
  GenerateRecommendationResponse 
} from './recommendations';
import { useNotificationSender } from '../../hooks/useNotifications';

/**
 * Hook para buscar a recomendação do usuário
 */
export function useRecommendation(userId: string) {
  return useQuery({
    queryKey: ['recommendation', userId],
    queryFn: () => getRecommendation(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 30, // 30 minutos
    gcTime: 1000 * 60 * 60, // 1 hora
    retry: (failureCount, error: any) => {
      // Retry específico para recomendações
      if (error?.message?.includes('Tempo limite')) {
        console.log('⏰ Timeout na busca de recomendação - fazendo retry');
        return failureCount < 2; // Até 2 tentativas para timeout
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Delay progressivo
      return Math.min(3000 * Math.pow(1.5, attemptIndex), 15000); // 3s, 4.5s, 6.75s, max 15s
    },
  });
}

/**
 * Hook para gerar nova recomendação
 */
export function useGenerateRecommendation() {
  const queryClient = useQueryClient();
  const { sendRecommendationNotification } = useNotificationSender();

  return useMutation({
    mutationFn: generateRecommendation,
    onSuccess: async (data, userId) => {
      // Atualizar cache da recomendação
      queryClient.setQueryData(['recommendation', userId], {
        hasRecommendation: true,
        recommendation: data.recommendation,
        generatedAt: data.generatedAt,
        user: data.user
      });
      
      // Invalidar para refetch
      queryClient.invalidateQueries({ queryKey: ['recommendation', userId] });
      
      // Enviar notificação
      try {
        await sendRecommendationNotification(data.recommendation);
        console.log('🔔 Notificação de recomendação enviada');
      } catch (error) {
        console.error('❌ Erro ao enviar notificação de recomendação:', error);
      }
      
      console.log('✅ Cache de recomendação atualizado');
    },
    onError: (error) => {
      console.error('❌ Erro ao gerar recomendação:', error);
    },
  });
}

/**
 * Hook para regenerar recomendação (admin/teste)
 */
export function useRegenerateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateRecommendation,
    onSuccess: (data, userId) => {
      // Limpar cache da recomendação para permitir nova geração
      queryClient.removeQueries({ queryKey: ['recommendation', userId] });
      
      console.log('✅ Cache de recomendação limpo para regeneração');
    },
    onError: (error) => {
      console.error('❌ Erro ao regenerar recomendação:', error);
    },
  });
} 