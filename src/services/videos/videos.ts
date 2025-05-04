// services/videos.ts
import api from '@/src/api/client';
import { UserVideo } from '@/src/types';

export const getVideosByUser = async (userId: string): Promise<UserVideo[]> => {
  const response = await api<{ videos: UserVideo[] }>(`users/${userId}/videos`, {
    method: 'GET',
  });

  return response.videos;
};

export const ServiceVideos = {
  getVideosByUser
};
