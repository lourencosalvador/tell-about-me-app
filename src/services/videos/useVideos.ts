import { useQuery } from "@tanstack/react-query";
import { ServiceVideos } from "./videos";

export function useGetVideos(userId: string) {
    return useQuery<any>({
      queryKey: ['get-videos', userId],
      queryFn: () => ServiceVideos.getVideosByUser(userId),
    })
  }