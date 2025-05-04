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
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface UserVideo {
    id: string;
    createdAt: string;
    transcription: string | null;
  }
  

  export interface AuthResponse {
    user: User;
    token: string;
  }