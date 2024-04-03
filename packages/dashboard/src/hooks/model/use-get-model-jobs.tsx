import jobService from "../../services/job";
import { Job, PaginatedDataQuery, JobFields } from "@jimmodel/shared";
import { useAppPaginatedSuspenseQuery } from "../../lib/react-query-wrapper/use-app-paginated-query";

export function useGetModelJob({ modelId }: { modelId: string; }) {
  return useAppPaginatedSuspenseQuery<Job, { sigal?: AbortSignal; query: PaginatedDataQuery<JobFields>; modelId: string; }, PaginatedDataQuery<JobFields>>({
    queryFn: jobService.getModelJobs,
    key: ["models", modelId, "jobs",],
    arg: { modelId },
    initialQuery: { pageSize: 5 }
  });
}

