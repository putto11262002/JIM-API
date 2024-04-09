import { Model } from "@jimmodel/shared";
import ModelCard from "./model-card";

function ModelGrid({ models }: { models: Model[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {models.map((model, index) => (
        <ModelCard model={model} key={index} />
      ))}
    </div>
  );
}


export default ModelGrid