import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/src/store/user';
import { useUserVideos } from '@/src/services/videos/useVideos';
import { useNotificationSender } from './useNotifications';

interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  type: 'video_upload' | 'skill_development' | 'consistency' | 'engagement';
  target: number;
  reward: number;
  durationDays: number;
  condition: (data: any) => boolean;
}

export function useChallenges() {
  const { user, gameStats, addChallenge, updateChallenge, completeChallenge } = useAuthStore();
  const { data: videos = [] } = useUserVideos(user?.id || '');
  const { sendChallengeNotification } = useNotificationSender();
  const lastChallengeCheck = useRef<Date>(new Date());

  // Templates de desafios
  const challengeTemplates: ChallengeTemplate[] = [
    {
      id: 'video_week',
      title: 'Semana Produtiva',
      description: 'Envie 3 vídeos em 7 dias',
      type: 'video_upload',
      target: 3,
      reward: 5,
      durationDays: 7,
      condition: (data) => data.videoCount >= 1 && data.videoCount < 10,
    },
    {
      id: 'skill_explorer',
      title: 'Explorador de Tecnologias',
      description: 'Mencione 2 novas tecnologias em seus vídeos',
      type: 'skill_development',
      target: 2,
      reward: 4,
      durationDays: 14,
      condition: (data) => data.technicalSkills >= 1 && data.technicalSkills < 5,
    },
    {
      id: 'consistency_master',
      title: 'Mestre da Consistência',
      description: 'Mantenha atividade por 5 dias consecutivos',
      type: 'consistency',
      target: 5,
      reward: 6,
      durationDays: 5,
      condition: (data) => data.consecutiveDays >= 1 && data.consecutiveDays < 7,
    },
    {
      id: 'video_marathon',
      title: 'Maratona de Vídeos',
      description: 'Envie 5 vídeos em 10 dias',
      type: 'video_upload',
      target: 5,
      reward: 8,
      durationDays: 10,
      condition: (data) => data.videoCount >= 3 && data.videoCount < 15,
    },
    {
      id: 'tech_master',
      title: 'Dominador de Tecnologias',
      description: 'Domine 5 tecnologias diferentes',
      type: 'skill_development',
      target: 5,
      reward: 10,
      durationDays: 21,
      condition: (data) => data.technicalSkills >= 2 && data.technicalSkills < 8,
    },
    {
      id: 'streak_legend',
      title: 'Lenda dos Streaks',
      description: 'Mantenha atividade por 10 dias consecutivos',
      type: 'consistency',
      target: 10,
      reward: 12,
      durationDays: 10,
      condition: (data) => data.consecutiveDays >= 3 && data.consecutiveDays < 10,
    },
  ];

  // Calcular dados atuais
  const getCurrentData = () => {
    const technicalKeywords = [
      'react', 'javascript', 'typescript', 'python', 'nodejs',
      'css', 'html', 'git', 'database', 'api', 'flutter', 'vue',
      'angular', 'docker', 'aws', 'mongodb', 'sql', 'php'
    ];
    
    const detectedSkills = new Set<string>();
    videos.forEach(video => {
      const text = video.transcription?.toLowerCase() || '';
      technicalKeywords.forEach(skill => {
        if (text.includes(skill)) {
          detectedSkills.add(skill);
        }
      });
    });

    return {
      videoCount: videos.length,
      technicalSkills: detectedSkills.size,
      consecutiveDays: gameStats.consecutiveDays,
      level: gameStats.currentLevel,
    };
  };

  // Verificar progresso dos desafios ativos
  const updateChallengesProgress = () => {
    const currentData = getCurrentData();
    const activeChallenges = gameStats.challenges.filter(c => !c.isCompleted);

    activeChallenges.forEach(challenge => {
      let newProgress = 0;

      switch (challenge.type) {
        case 'video_upload':
          // Contar vídeos desde o início do desafio
          const challengeStart = new Date(challenge.createdAt);
          const videosAfterChallenge = videos.filter(v => 
            new Date(v.createdAt) >= challengeStart
          ).length;
          newProgress = videosAfterChallenge;
          break;

        case 'skill_development':
          newProgress = currentData.technicalSkills;
          break;

        case 'consistency':
          newProgress = currentData.consecutiveDays;
          break;

        default:
          newProgress = challenge.current;
      }

      // Atualizar progresso
      if (newProgress !== challenge.current) {
        updateChallenge(challenge.id, newProgress);

        // Verificar se foi completado
        if (newProgress >= challenge.target && !challenge.isCompleted) {
          completeChallenge(challenge.id);
          
          // Enviar notificação de conclusão
          sendChallengeNotification({
            title: `✅ Desafio Concluído!`,
            description: `Parabéns! Você completou "${challenge.title}" e ganhou ${challenge.reward} streaks!`,
            reward: challenge.reward,
            deadline: new Date(challenge.deadline),
          });
        }
      }
    });
  };

  // Gerar novos desafios
  const generateNewChallenges = () => {
    const currentData = getCurrentData();
    const activeChallenges = gameStats.challenges.filter(c => !c.isCompleted);
    
    // Máximo de 2 desafios ativos por vez
    if (activeChallenges.length >= 2) return;

    // Não gerar novos desafios com muita frequência
    const hoursSinceLastCheck = (Date.now() - lastChallengeCheck.current.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastCheck < 12) return; // Mínimo 12 horas entre novos desafios

    // Encontrar desafios adequados
    const suitableChallenges = challengeTemplates.filter(template => {
      // Verificar se já tem esse tipo de desafio ativo
      const hasActiveOfType = activeChallenges.some(c => c.type === template.type);
      if (hasActiveOfType) return false;

      // Verificar se atende às condições
      return template.condition(currentData);
    });

    if (suitableChallenges.length > 0) {
      // Selecionar desafio aleatório
      const randomChallenge = suitableChallenges[Math.floor(Math.random() * suitableChallenges.length)];
      
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + randomChallenge.durationDays);

      // Adicionar desafio
      addChallenge({
        title: randomChallenge.title,
        description: randomChallenge.description,
        type: randomChallenge.type,
        target: randomChallenge.target,
        current: 0,
        reward: randomChallenge.reward,
        deadline,
        isCompleted: false,
      });

      // Enviar notificação
      sendChallengeNotification({
        title: randomChallenge.title,
        description: randomChallenge.description,
        reward: randomChallenge.reward,
        deadline,
      });

      lastChallengeCheck.current = new Date();
    }
  };

  // Remover desafios expirados
  const cleanExpiredChallenges = () => {
    const now = new Date();
    const activeChallenges = gameStats.challenges.filter(challenge => {
      const isExpired = new Date(challenge.deadline) < now && !challenge.isCompleted;
      return !isExpired;
    });

    // Se houver mudanças, atualizar (isso seria feito via uma função no store)
    // Por agora, apenas logamos
    const expiredCount = gameStats.challenges.length - activeChallenges.length;
    if (expiredCount > 0) {
      console.log(`🗑️ Removidos ${expiredCount} desafios expirados`);
    }
  };

  // Efeitos
  useEffect(() => {
    updateChallengesProgress();
    generateNewChallenges();
    cleanExpiredChallenges();
  }, [videos.length, gameStats.consecutiveDays]);

  // Executar verificação periódica
  useEffect(() => {
    const interval = setInterval(() => {
      updateChallengesProgress();
      generateNewChallenges();
      cleanExpiredChallenges();
    }, 60000 * 30); // A cada 30 minutos

    return () => clearInterval(interval);
  }, []);

  return {
    activeChallenges: gameStats.challenges.filter(c => !c.isCompleted && new Date(c.deadline) > new Date()),
    completedChallenges: gameStats.challenges.filter(c => c.isCompleted),
    updateChallengesProgress,
    generateNewChallenges,
  };
} 