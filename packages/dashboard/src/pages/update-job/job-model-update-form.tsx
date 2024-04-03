import useGetJob from "../../hooks/job/use-get-job";
import { useRemoveModel } from "../../hooks/job/use-remove-model";
import { useAddModel } from "../../hooks/job/use-add-model";
import ModelTable from "../../components/job/model-table";
import { AddModelDialog } from "../../components/job/add-model-dialog";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { useSearchModelWithfilter } from "../../hooks/model/use-search-model-with-filter";

export default function JobModelUpdateForm({ jobId }: { jobId: string }) {
  const { job } = useGetJob({ jobId });
  const { removeModel } = useRemoveModel();
  const { addModel } = useAddModel();
  const { models, updateSearchTerm } = useSearchModelWithfilter({ filter: job.models  });

  return (
    <>
      <div className="">
        <AddModelDialog
          searchedModels={models}
          onSearchModel={(searchTerm) => updateSearchTerm(searchTerm)}
          onAddModel={(model) => addModel({ id: jobId, modelId: model.id })}
        >
          <Button variant={"outline"}>
            <Plus className="w-4 h-4 mr-2" /> Model
          </Button>
        </AddModelDialog>
      </div>
      <div className="mt-4">
        <ModelTable
          models={job.models}
          onRemoveModel={(model) =>
            removeModel({ id: jobId, modelId: model.id })
          }
        />
      </div>
    </>
  );
}
