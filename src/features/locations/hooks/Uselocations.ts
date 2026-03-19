import { useQuery } from '@tanstack/react-query';
import { locationsApi } from '@/api/locations.api';
import { queryKeys } from '@/utils/queryKeys';

export const useLocations = () =>
  useQuery({
    queryKey: queryKeys.locations.all,
    queryFn: locationsApi.getAll,
    staleTime: 1000 * 60 * 10,
  });
