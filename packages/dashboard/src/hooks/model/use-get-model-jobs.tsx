import jobService from "../../services/job";
import { useQuery } from "@tanstack/react-query";

export default function useGetModelJobs({ id }: { id: string }) {
  const { isLoading, data } = useQuery({
    queryKey: ["models", id, "jobs", { page: 1, pageSize: 10 }],
    queryFn: id
      ? ({ signal }) =>
          jobService.getModelJobs({
            modelId: id,
            query: { page: 1, pageSize: 10 },
            signal,
          })
      : undefined,
    enabled: !!id,
  });
  return { jobs: data?.data ?? [], isLoading };
}
