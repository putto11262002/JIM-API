import { useAppSuspenseQuery } from "../../lib/react-query-wrapper/use-app-query";
import modelApplicationService from "../../services/applications";

export function useGetApplication({id}: {id: string}){
    const returned = useAppSuspenseQuery({
        queryFn: modelApplicationService.getById,
        arg: {id},
        key: ["applications", id],
    })

    return {...returned, application: returned.data}
}