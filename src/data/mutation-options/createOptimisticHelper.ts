import { useQueryClient } from "@tanstack/react-query";

function createOptimisticHelper(queryKey: string[]) {
  const queryClient = useQueryClient();

  const optimisticUpdate = async <T>(
    updater: (oldData?: T) => T | undefined
  ): Promise<{ previousData?: T } | undefined> => {
    await queryClient.cancelQueries({ queryKey });
    const previousData = queryClient.getQueryData<T>(queryKey);
    queryClient.setQueryData<T>(queryKey, updater);
    return { previousData };
  };

  const rollback = <T>(previousData: T) => {
    queryClient.setQueryData(queryKey, previousData);
  };

  const invalidate = (queryKey: string[]) => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { optimisticUpdate, rollback, invalidate };
}

export default createOptimisticHelper;
