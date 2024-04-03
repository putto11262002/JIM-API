import modelService from "../../services/model";
import { useAppSuspenseQuery } from "../../lib/react-query-wrapper/use-app-query";

export function useGetModel({ modelId }: { modelId: string; }) {
  const returned = useAppSuspenseQuery({
    queryFn: modelService.getById,
    key: ["models", modelId],
    arg: { id: modelId },
    staleTime: 1000 * 60 * 2,
  });

  return { ...returned, model: returned.data };
}
