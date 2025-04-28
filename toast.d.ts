declare module 'react-native-toast-message' {
    export function show(options: {
      type: 'success' | 'error' | 'info';
      text1: string;
      text2?: string;
      position?: 'top' | 'bottom';
      visibilityTime?: number;
    }): void;
    
    export function hide(): void;
    
    export const Toast: React.ComponentType<any>;
  }