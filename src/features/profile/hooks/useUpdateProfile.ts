import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, type UpdateProfilePayload } from '@/api/user.api';
import { useAuthStore } from '@/store/auth.store';
import { queryKeys } from '@/utils/queryKeys';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore(s => s.updateUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userApi.updateMe(payload),
    onSuccess: user => {
      updateUser(user);
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
};
