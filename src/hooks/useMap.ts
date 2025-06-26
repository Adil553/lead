import { QUERY_KEYS } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { mapService } from "@/services/mapService";

export const useGetAddress = (lat: number | null, long: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADDRESS, lat, long],
    queryFn: () => mapService.getAddress(lat, long),
    enabled: Boolean(lat) && Boolean(long),
    staleTime: 60 * 60 * 1000, // cache for 6 hours
  });
};

export const useGetAddressList = (query: string, countryCode: string) => {
  const debouncedQuery = useDebounce(query, 500); // delay of 500ms

  return useQuery({
    queryKey: [QUERY_KEYS.ADDRESS_LIST, debouncedQuery, countryCode],
    queryFn: () => mapService.getAddressList(debouncedQuery, countryCode),
    enabled: Boolean(debouncedQuery) && Boolean(countryCode),
    staleTime: 60 * 60 * 1000, // cache for 6 hours
  });
};

export const useGetDistance = (
  long1: number,
  lat1: number,
  long2: number,
  lat2: number,
  orderType: number
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DISTANCE, long1, lat1, long2, lat2],
    queryFn: () => mapService.getDistance(long1, lat1, long2, lat2),
    enabled:
      Boolean(lat1) &&
      Boolean(long1) &&
      Boolean(lat2) &&
      Boolean(long2) &&
      orderType === 3,
    staleTime: 6 * 60 * 60 * 1000, // cache for 6 hours
  });
};
