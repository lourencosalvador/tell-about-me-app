import { useAuthStore } from '@/src/store/user';

interface UserTitle {
  title: string;
  color: string;
  emoji: string;
  description: string;
}

export function useUserTitle(): UserTitle {
  const { gameStats } = useAuthStore();
  const level = gameStats.currentLevel;

  // Sistema de títulos baseado no nível
  if (level >= 20) {
    return {
      title: 'Lenda',
      color: '#FFD700', // Dourado
      emoji: '👑',
      description: 'Alcançou o status lendário'
    };
  } else if (level >= 15) {
    return {
      title: 'Mestre',
      color: '#9333EA', // Roxo
      emoji: '🌟',
      description: 'Mestre absoluto da plataforma'
    };
  } else if (level >= 10) {
    return {
      title: 'Expert',
      color: '#EF4444', // Vermelho
      emoji: '🔥',
      description: 'Expert em desenvolvimento'
    };
  } else if (level >= 7) {
    return {
      title: 'Avançado',
      color: '#F59E0B', // Laranja
      emoji: '⚡',
      description: 'Desenvolvedor avançado'
    };
  } else if (level >= 5) {
    return {
      title: 'Intermediário',
      color: '#3B82F6', // Azul
      emoji: '🚀',
      description: 'Desenvolvedor intermediário'
    };
  } else if (level >= 3) {
    return {
      title: 'Júnior',
      color: '#10B981', // Verde
      emoji: '🌱',
      description: 'Desenvolvedor júnior'
    };
  } else {
    return {
      title: 'Iniciante',
      color: '#6B7280', // Cinza
      emoji: '🎯',
      description: 'Começando a jornada'
    };
  }
}

// Hook para obter título baseado em conquistas específicas
export function useUserAchievementTitle(): UserTitle | null {
  const { gameStats } = useAuthStore();
  
  // Verificar conquistas especiais para títulos únicos
  const hasExpertAchievement = gameStats.achievements.some(a => a.name === 'Expert');
  const hasMasterAchievement = gameStats.achievements.some(a => a.name === 'Mestre');
  const hasConsistentAchievement = gameStats.achievements.some(a => a.name === 'Consistente');
  const hasPolivalenteAchievement = gameStats.achievements.some(a => a.name === 'Polivalente');

  // Títulos especiais baseados em combinações de conquistas
  if (hasExpertAchievement && hasMasterAchievement && hasConsistentAchievement) {
    return {
      title: 'Code Lenda',
      color: '#FFD700',
      emoji: '👑',
      description: 'Lenda absoluta do código'
    };
  } else if (hasExpertAchievement && hasPolivalenteAchievement) {
    return {
      title: 'Code Master',
      color: '#9333EA',
      emoji: '🎯',
      description: 'Mestre versátil do código'
    };
  } else if (hasConsistentAchievement && hasPolivalenteAchievement) {
    return {
      title: 'Code Warrior',
      color: '#EF4444',
      emoji: '⚔️',
      description: 'Guerreiro consistente do código'
    };
  }

  return null;
} 