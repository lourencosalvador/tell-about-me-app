import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  class: string;
  photoUrl: string;
  recommendation?: any;
  streak?: number;
}

interface AuthState {
  user: User | null;
  gameStats: GameStats;
  isAuthenticated: boolean;
  token?: string;
  login: (response: { user: User; token: string }) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addStreaks: (amount: number) => void;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'earnedAt'>) => void;
  addChallenge: (challenge: Omit<Challenge, 'id' | 'createdAt'>) => void;
  updateChallenge: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  updateActivity: () => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  streakReward: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'video_upload' | 'skill_development' | 'consistency' | 'engagement';
  target: number;
  current: number;
  reward: number;
  deadline: Date;
  isCompleted: boolean;
  createdAt: Date;
}

interface GameStats {
  totalStreaks: number;
  currentLevel: number;
  xp: number;
  achievements: Achievement[];
  challenges: Challenge[];
  lastActivityDate: string;
  consecutiveDays: number;
}

interface UserState {
  user: UserData | null;
  gameStats: GameStats;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      gameStats: {
        totalStreaks: 0,
        currentLevel: 1,
        xp: 0,
        achievements: [],
        challenges: [],
        lastActivityDate: '',
        consecutiveDays: 0,
      },
      isAuthenticated: false,
      token: undefined,
      login: (response: { user: User; token: string }) => {
        set({ user: response.user, isAuthenticated: true, token: response.token });
      },
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          gameStats: {
            totalStreaks: 0,
            currentLevel: 1,
            xp: 0,
            achievements: [],
            challenges: [],
            lastActivityDate: '',
            consecutiveDays: 0,
          },
          token: undefined
        });
      },
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      addStreaks: (amount: number) => {
        const currentStats = get().gameStats;
        const newStreaks = currentStats.totalStreaks + amount;
        const newXP = currentStats.xp + (amount * 10);
        const newLevel = Math.floor(newXP / 100) + 1;
        
        set({
          gameStats: {
            ...currentStats,
            totalStreaks: newStreaks,
            xp: newXP,
            currentLevel: newLevel,
          }
        });
      },
      addAchievement: (achievement) => {
        const currentStats = get().gameStats;
        const newAchievement: Achievement = {
          ...achievement,
          id: Date.now().toString(),
          earnedAt: new Date(),
        };
        
        set({
          gameStats: {
            ...currentStats,
            achievements: [...currentStats.achievements, newAchievement],
          }
        });
        
        // Adicionar streaks da conquista
        get().addStreaks(achievement.streakReward);
      },
      addChallenge: (challenge) => {
        const currentStats = get().gameStats;
        const newChallenge: Challenge = {
          ...challenge,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        
        set({
          gameStats: {
            ...currentStats,
            challenges: [...currentStats.challenges, newChallenge],
          }
        });
      },
      updateChallenge: (challengeId: string, progress: number) => {
        const currentStats = get().gameStats;
        const updatedChallenges = currentStats.challenges.map(challenge => {
          if (challenge.id === challengeId) {
            return { ...challenge, current: progress };
          }
          return challenge;
        });
        
        set({
          gameStats: {
            ...currentStats,
            challenges: updatedChallenges,
          }
        });
      },
      completeChallenge: (challengeId: string) => {
        const currentStats = get().gameStats;
        const challenge = currentStats.challenges.find(c => c.id === challengeId);
        
        if (challenge && !challenge.isCompleted) {
          const updatedChallenges = currentStats.challenges.map(c => {
            if (c.id === challengeId) {
              return { ...c, isCompleted: true };
            }
            return c;
          });
          
          set({
            gameStats: {
              ...currentStats,
              challenges: updatedChallenges,
            }
          });
          
          // Adicionar recompensa
          get().addStreaks(challenge.reward);
        }
      },
      updateActivity: () => {
        const currentStats = get().gameStats;
        const today = new Date().toDateString();
        const lastActivity = new Date(currentStats.lastActivityDate).toDateString();
        
        let consecutiveDays = currentStats.consecutiveDays;
        
        if (lastActivity !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastActivity === yesterday.toDateString()) {
            consecutiveDays += 1;
          } else if (lastActivity !== today) {
            consecutiveDays = 1;
          }
        }
        
        set({
          gameStats: {
            ...currentStats,
            lastActivityDate: today,
            consecutiveDays,
          }
        });
      },
    }),
    {
      name: 'auth-storage-fresh',
      storage: createJSONStorage(() => AsyncStorage, {
        reviver: (key, value) => {
          // Recriar objetos Date ao deserializar
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            return new Date(value);
          }
          return value;
        },
        replacer: (key, value) => {
          // Converter Date para string ao serializar
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }
      }),
      partialize: (state) => ({
        user: state.user,
        gameStats: state.gameStats,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('✅ Storage rehydrated successfully');
        } else {
          console.warn('⚠️ Storage rehydration failed, using default state');
        }
      },
    }
  )
);