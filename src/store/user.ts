import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  class: string;
  photoUrl: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: ({ user, token }) => 
        set({ 
          user,
          token,
          isAuthenticated: true 
        }),
      
      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        }),
      
      updateUser: (userData) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, ...userData } : null 
        })),
    }),
    {
      name: 'auth-storage', // Nome do storage
      storage: createJSONStorage(() => AsyncStorage), // Usando AsyncStorage no React Native
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }), // O que será persistido
    }
  )
);