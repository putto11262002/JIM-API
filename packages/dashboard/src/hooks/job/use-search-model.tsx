import { Model, ModelGetQuery } from "@jimmodel/shared";
import { useAppPaginatedQuery } from "../../lib/react-query-wrapper/use-app-paginated-query";
import modelService from "../../services/model";
import { useMemo } from "react";
import useGetJob from "./use-get-job";

export function useSearchModel({jobId}: {jobId: string}){
    const {job} = useGetJob({jobId})
    const {
        data: models,
        updateQuery,
        query,
      } = useAppPaginatedQuery<
        Model,
        { signal?: AbortSignal; query: ModelGetQuery },
        ModelGetQuery
      >({
        queryFn: modelService.getAll,
        key: ["models"],
        arg: {},
        initialQuery: { pageSize: 10 },
      });
    
      const unaddedModels = useMemo(() => {
        if (models && job?.models) {
          return models.filter(
            (model) => !job.models.find((m) => m.id === model.id)
          );
        }
        return [];
      }, [models, job?.models]);

      function updateSearchTerm(searchTerm: string) {
        updateQuery((prevQuery) => ({ ...prevQuery, q: searchTerm }));
      }


    return {models: unaddedModels, updateSearchTerm, searchTerm: query.q || ""}
}