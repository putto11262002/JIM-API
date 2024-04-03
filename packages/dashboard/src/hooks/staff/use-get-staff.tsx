import { useAppSuspenseQuery } from "../../lib/react-query-wrapper/use-app-query";
import staffService from "../../services/auth";

export function useGetStaff({staffId}: {staffId: string}){
  const returned = useAppSuspenseQuery({
    queryFn: staffService.getById,
    key: ["staff", staffId],
    arg: {id: staffId}
  })

  return {...returned, staff: returned.data}
}