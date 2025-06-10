import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/src/store/user';
import { useUserVideos } from '@/src/services/videos/useVideos';
import { useNotificationSender } from './useNotifications';

interface AchievementConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  streakReward: number;
  condition: (data: any) => boolean;
  notificationTitle: string;
  notificationBody: string;
}

export function useAchievements() {
  const { user, gameStats, addAchievement, updateActivity } = useAuthStore();
  const { data: videos = [] } = useUserVideos(user?.id || '');
  const { sendAchievementNotification } = useNotificationSender();
  const [technicalSkills, setTechnicalSkills] = useState(0);
  const processedAchievements = useRef(new Set<string>());

  // Configuração das conquistas
  const achievements: AchievementConfig[] = [
    {
      id: 'primeiro_video',
      name: 'Primeiro Vídeo',
      description: 'Enviou seu primeiro vídeo!',
      icon: '🎬',
      streakReward: 3,
      condition: (data) => data.videoCount >= 1,
      notificationTitle: '🎬 Primeira Conquista Desbloqueada!',
      notificationBody: 'Parabéns! Você enviou seu primeiro vídeo e ganhou 3 streaks! Continue assim! 🚀',
    },
    {
      id: 'dedicado',
      name: 'Dedicado',
      description: 'Enviou 5 vídeos ou mais',
      icon: '⚡',
      streakReward: 5,
      condition: (data) => data.videoCount >= 5,
      notificationTitle: '⚡ Conquista Dedicado Desbloqueada!',
      notificationBody: 'Incrível! 5 vídeos enviados! Você ganhou 5 streaks como recompensa! 🎯',
    },
    {
      id: 'polivalente',
      name: 'Polivalente',
      description: 'Dominou 3 ou mais tecnologias',
      icon: '🚀',
      streakReward: 4,
      condition: (data) => data.technicalSkills >= 3,
      notificationTitle: '🚀 Conquista Polivalente Desbloqueada!',
      notificationBody: 'Fantástico! Você domina 3+ tecnologias e ganhou 4 streaks! Versatilidade é poder! 💪',
    },
    {
      id: 'expert',
      name: 'Expert',
      description: 'Enviou 10 vídeos ou mais',
      icon: '🏆',
      streakReward: 10,
      condition: (data) => data.videoCount >= 10,
      notificationTitle: '🏆 Conquista Expert Desbloqueada!',
      notificationBody: 'LENDÁRIO! 10 vídeos enviados! Você é um expert e ganhou 10 streaks! 👑',
    },
    {
      id: 'consistente',
      name: 'Consistente',
      description: '7 dias consecutivos de atividade',
      icon: '🔥',
      streakReward: 7,
      condition: (data) => data.consecutiveDays >= 7,
      notificationTitle: '🔥 Conquista Consistente Desbloqueada!',
      notificationBody: '7 dias seguidos! Você está em chamas e ganhou 7 streaks! Disciplina é o caminho! 🎖️',
    },
    {
      id: 'mestre',
      name: 'Mestre',
      description: 'Atingiu nível 5 ou superior',
      icon: '👑',
      streakReward: 15,
      condition: (data) => data.level >= 5,
      notificationTitle: '👑 Conquista Mestre Desbloqueada!',
      notificationBody: 'ÉPICO! Nível 5 alcançado! Você é um verdadeiro mestre e ganhou 15 streaks! 🌟',
    },
  ];

  // Calcular habilidades técnicas
  useEffect(() => {
    const technicalKeywords = [
      'react', 'javascript', 'typescript', 'python', 'nodejs',
      'css', 'html', 'git', 'database', 'api'
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
    
    setTechnicalSkills(detectedSkills.size);
  }, [videos]);

  // Verificar conquistas apenas quando dados relevantes mudarem
  useEffect(() => {
    if (!user?.id) return;

    // Atualizar atividade
    updateActivity();

    const currentData = {
      videoCount: videos.length,
      technicalSkills: technicalSkills,
      consecutiveDays: gameStats.consecutiveDays,
      level: gameStats.currentLevel,
    };

    console.log('🏆 Verificando conquistas:', currentData);

    achievements.forEach(achievement => {
      const alreadyEarned = gameStats.achievements.some(earned => earned.name === achievement.name);
      const alreadyProcessed = processedAchievements.current.has(achievement.id);
      
      if (!alreadyEarned && !alreadyProcessed && achievement.condition(currentData)) {
        console.log(`🎉 Nova conquista desbloqueada: ${achievement.name}`);
        
        // Marcar como processada ANTES de enviar
        processedAchievements.current.add(achievement.id);

        // Adicionar conquista
        addAchievement({
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          streakReward: achievement.streakReward,
        });

        // Enviar notificação
        sendAchievementNotification({
          title: achievement.notificationTitle,
          body: achievement.notificationBody,
          icon: achievement.icon,
          streakReward: achievement.streakReward,
        });
      }
    });
  }, [user?.id, videos.length, technicalSkills, gameStats.consecutiveDays, gameStats.currentLevel]);

  return {
    achievements: gameStats.achievements,
    totalStreaks: gameStats.totalStreaks,
    currentLevel: gameStats.currentLevel,
    xp: gameStats.xp,
    consecutiveDays: gameStats.consecutiveDays,
  };
} 