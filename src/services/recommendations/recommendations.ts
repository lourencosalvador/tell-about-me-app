import { api } from '@/src/api/client';

export interface Recommendation {
  area_recomendada: string;
  justificativa: string;
}

export interface RecommendationResponse {
  hasRecommendation: boolean;
  recommendation?: Recommendation;
  generatedAt?: string;
  message?: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface GenerateRecommendationResponse {
  success: boolean;
  recommendation: Recommendation;
  transcriptionsAnalyzed: number;
  generatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface GenerateRecommendationError {
  error: string;
  nextAllowedAt?: string;
  details?: string;
}

/**
 * Busca a recomendação existente do usuário
 */
export async function getRecommendation(userId: string): Promise<RecommendationResponse> {
  try {
    console.log(`📊 Buscando recomendação para usuário: ${userId}`);
    
    const response = await api(`/users/${userId}/recommendation`, {
      timeout: 30000, // 30 segundos
    }) as RecommendationResponse;
    
    console.log(`✅ Recomendação encontrada:`, response.hasRecommendation);
    return response;
  } catch (error) {
    console.error('❌ Erro ao buscar recomendação:', error);
    throw error;
  }
}

/**
 * Gera uma nova recomendação baseada nas transcrições do usuário
 */
export async function generateRecommendation(userId: string): Promise<GenerateRecommendationResponse> {
  try {
    console.log(`🤖 Gerando recomendação para usuário: ${userId}`);
    
    const response = await api(`/users/${userId}/recommendation/generate`, {
      method: 'POST',
      body: {},
      timeout: 60000, // 60 segundos para gerar recomendação (pode demorar mais)
    }) as GenerateRecommendationResponse;
    
    console.log(`✅ Recomendação gerada:`, response.recommendation.area_recomendada);
    return response;
  } catch (error) {
    console.error('❌ Erro ao gerar recomendação:', error);
    throw error;
  }
}

/**
 * Regenera a recomendação (para testes/admin)
 */
export async function regenerateRecommendation(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`🔄 Regenerando recomendação para usuário: ${userId}`);
    
    const response = await api(`/users/${userId}/recommendation/regenerate`, {
      method: 'POST',
      body: {},
      timeout: 60000, // 60 segundos
    }) as { success: boolean; message: string };
    
    console.log(`✅ Recomendação resetada`);
    return response;
  } catch (error) {
    console.error('❌ Erro ao regenerar recomendação:', error);
    throw error;
  }
} 