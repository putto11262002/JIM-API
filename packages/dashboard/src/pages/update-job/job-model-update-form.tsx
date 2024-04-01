import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import JobModelForm from "../../components/job/job-model-form";
import LoaderBlock from "../../components/shared/loader-block";
import useGetJob from "../../hooks/job/use-get-job";
import jobService from "../../services/job";
import useNotification from "../../hooks/use-notification";
import { useMemo, useState } from "react";
import modelService from "../../services/model";

function useSearchModel() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useQuery({
    queryKey: ["models", { q: searchTerm }],
    queryFn: ({ signal }) => modelService.getAll({ q: searchTerm }, signal),
    enabled: searchTerm !== "",
  });

  return { models: data, setSearchTerm };
}

function useJobAddModel() {
  const { success } = useNotification();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ jobId, modelId }: { jobId: string; modelId: string }) =>
      jobService.addModel({ id: jobId, modelId }),
    onSuccess: (_, {jobId}) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
      success("Model added to job");
    },
  });

  return { addModel: mutate };
}

function useJobRemoveModel() {
  const { success } = useNotification();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ modelId, jobId }: { modelId: string; jobId: string }) =>
      jobService.removeModel({ id: jobId, modelId }),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
      success("Model removed from job");
    },
  });

  return { removeModel: mutate };
}

export default function JobModelUpdateForm({ jobId }: { jobId?: string }) {
  const { job, status } = useGetJob({ jobId });
  const { models, setSearchTerm } = useSearchModel();
  const { addModel } = useJobAddModel();
  const { removeModel } = useJobRemoveModel();

  const unaddedModels = useMemo(() => {
    if (models?.data && job?.models) {
      return models.data.filter(
        (model) => !job.models.find((m) => m.id === model.id)
      );
    }
    return [];
  }, [models, job?.models]);

  if (status === "pending" || !jobId) {
    return <LoaderBlock />;
  }
  return (
    <JobModelForm
      models={job?.models || []}
      searchedModels={unaddedModels}
      onAddModel={(model) => addModel({ jobId, modelId: model.id })}
      onRemoveModel={(modelId) => removeModel({ modelId, jobId })}
      onSeachTermChange={(searchTerm) => setSearchTerm(searchTerm)}
    />
  );
}
