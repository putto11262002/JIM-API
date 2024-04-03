import jobService from "../../services/job";
import { useAppSuspenseQuery } from "../../lib/react-query-wrapper/use-app-query";
export default function useGetJob({ jobId }: { jobId: string }) {
  const { data, status, error } = useAppSuspenseQuery({
    queryFn: jobService.getById,
    key: ["jobs", jobId],
    arg: { id: jobId },
    staleTime: 1000 * 60 * 2
  });

  return { job: data, status, error };
}
