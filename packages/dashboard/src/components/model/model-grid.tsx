import { Model } from "@jimmodel/shared";
import ModelCard from "./model-card";

export default function ModelGrid({ models }: { models: Model[] }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3 ">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </>
  );
}
