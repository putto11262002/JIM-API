import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Model } from "@jimmodel/shared";
import { Avatar, AvatarImage } from "../../ui/avatar";
import placeholderImage from "@assets/placeholder.jpeg";
import ModelTable from "./model-table";

export function AddModelDialog({
  searchedModels,
  onSeachTermChange,
  onAddModel,
}: {
  searchedModels?: Model[];
  onSeachTermChange: (term: string) => void;
  onAddModel: (model: Model) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus className="w-4 h-4 mr-2" /> Model
        </Button>
      </DialogTrigger>

      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Model</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            onChange={(e) => onSeachTermChange(e.target.value)}
            placeholder="Search for model..."
          />
          <div className="">
            {searchedModels?.map((model) => (
              <div
                className="py-2 px-3 rounded-md hover:bg-slate-100 flex items-center"
                key={model.id}
              >
                <Avatar>
                  <AvatarImage
                    src={model.images?.[0]?.url || placeholderImage}
                  />
                </Avatar>
                <div className="ml-4">
                  <p className="text-sm font-medium">
                    {model.firstName} {model.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{model.email}</p>
                </div>
                <Button
                  onClick={() => onAddModel(model)}
                  className="ml-auto"
                  variant={"ghost"}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function JobModelForm({
  onSeachTermChange,
  searchedModels,
  onAddModel,
  models,
  onRemoveModel
}: {
  onSeachTermChange: (term: string) => void;
  searchedModels?: Model[];
  onAddModel: (model: Model) => void;
  models?: Model[];
  onRemoveModel: (modelId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <AddModelDialog
          searchedModels={searchedModels}
          onSeachTermChange={onSeachTermChange}
          onAddModel={onAddModel}
        />
      </div >
     <div>
     <ModelTable onRemoveModel={onRemoveModel} models={models || []} />
     </div>
    </div>
  );
}

export default JobModelForm;
