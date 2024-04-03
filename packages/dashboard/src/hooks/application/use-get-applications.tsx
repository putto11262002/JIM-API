import { ModelApplication, ModelApplicationGetQuery, ModelApplicationStatus } from "@jimmodel/shared";
import { useAppPaginatedQuery } from "../../lib/react-query-wrapper/use-app-paginated-query";
import modelApplicationService from "../../services/applications";

export function useGetApplications(){
    const returned = useAppPaginatedQuery<ModelApplication, {signal?: AbortSignal; query: ModelApplicationGetQuery}, ModelApplicationGetQuery>({
        queryFn: modelApplicationService.getAll,
        key: ["applications"],
        initialQuery:{status: ModelApplicationStatus.PENDING},
        arg: {}
    })

    return returned

}