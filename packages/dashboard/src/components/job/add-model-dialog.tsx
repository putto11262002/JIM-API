import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Model } from "@jimmodel/shared";
import { Avatar, AvatarImage } from "../ui/avatar";
import React from "react";
import placeholderImage from "@assets/placeholder.jpeg";

export function AddModelDialog({ onAddModel, children, onSearchModel, searchedModels }: { onAddModel: (model: Model) => void, children: React.ReactNode, onSearchModel: (term: string) => void, searchedModels: Model[]}) {


  return (
    <Dialog>
      <DialogTrigger asChild>
       {children}
      </DialogTrigger>

      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Model</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            onChange={(e) => {
              onSearchModel(e.target.value);
            }}
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
                    className="object-cover"
                    src={model.images?.[0]?.url || placeholderImage}
                  />
                </Avatar>
                <div className="ml-4">
                  <p className="text-sm font-medium">
                    {model.name}
                  </p>
                  {/* <p className="text-xs text-muted-foreground">{model.email}</p> */}
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