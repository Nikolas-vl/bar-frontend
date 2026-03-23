import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsApi, type UpdateSettingsBody } from '@/api/admin/settings.api';
import { queryKeys } from '@/utils/queryKeys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSettingsBody) => adminSettingsApi.update(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      toast.success('Settings updated');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};
