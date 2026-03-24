import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/shared/lib/api/settings.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';

export const useSettings = () =>
  useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: settingsApi.getSettings,
    staleTime: 1000 * 60 * 5, // cache 5 min — settings rarely change
  });
