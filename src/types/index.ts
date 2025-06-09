export interface VideoMetadata {
    id: string;
    url: string;
    thumbnail?: string; 
    createdAt: Date;
    fileName: string;
}

export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    class: string;       
    photo?: any;
    photoUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

export interface UserVideo {
  id: string;
  url?: string;
  thumbnail?: string;
  fileName?: string;
  createdAt: string;
  updatedAt?: string;
  transcription: string | null;
  duration?: number;
  fileSize?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UploadProgress {
  progress: number;
  uploaded: number;
  total: number;
}