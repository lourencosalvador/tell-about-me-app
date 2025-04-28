import api from "@/src/api/client"
import { AuthResponse, User } from "@/src/types"

const create = async (data: User) => {
    const response = await api<User>('users', {
      method: 'POST',
      body: data,
    });
  
    return response;
  };

 const loginUser = async (credentials: { email: string, password: string }) => {
    try {
      const response = await api<AuthResponse>('users/auth', {
        method: 'POST',
        body: credentials,
      });
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

export const UserService = {
    create,
    loginUser
  }
  
  