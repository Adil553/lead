import { configService } from "@/services/configService";
import { QUERY_KEYS } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useGetConfig = (storeId: number | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CONFIG, storeId],
    queryFn: () => configService.getConfig(storeId),
    enabled: Boolean(storeId),
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000, // 1 hour
    refetchIntervalInBackground: true,
  });
};

export const useGetLovs = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOVS],
    queryFn: () => configService.getLovs(),
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000, // 1 hour
    refetchIntervalInBackground: true,
  });
};

export const useGetIpInfo = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.IP_INFO],
    queryFn: () => configService.getIpInfo(),
    staleTime: 60 * 60 * 1000, // 5 minutes: data is fresh for this duration
    refetchInterval: 60 * 60 * 1000, // refetch every 5 minutes
    refetchIntervalInBackground: true, // optional for React web; no effect on mobile when app is in background
  });
};
