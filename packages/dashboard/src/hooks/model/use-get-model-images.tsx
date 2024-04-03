import modelService from "../../services/model";
import { ModelImage } from "@jimmodel/shared";
import { useAppSuspenseQuery } from "../../lib/react-query-wrapper/use-app-query";

export function useGetModelImage({ modelId }: { modelId: string; }) {
  const returned =  useAppSuspenseQuery<ModelImage[], { signal?: AbortSignal; id: string; }>({
    queryFn: modelService.getImages,
    key: ["models", modelId, "images"],
    arg: { id: modelId },
  });

  return {...returned, images: returned.data};
}
