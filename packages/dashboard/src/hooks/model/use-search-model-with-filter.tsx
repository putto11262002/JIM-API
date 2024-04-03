import { Model, ModelGetQuery } from "@jimmodel/shared";
import { useAppPaginatedQuery } from "../../lib/react-query-wrapper/use-app-paginated-query";
import modelService from "../../services/model";
import { useMemo } from "react";


export function useSearchModelWithfilter({filter}: {filter: {id: string}[]}){
   
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
        if (models ) {
          return models.filter(
            (model) => !filter.find((m) => m.id === model.id)
          );
        }
        return [];
      }, [models, filter]);

      function updateSearchTerm(searchTerm: string) {
        updateQuery((prevQuery) => ({ ...prevQuery, q: searchTerm }));
      }


    return {models: unaddedModels, updateSearchTerm, searchTerm: query.q || ""}
}