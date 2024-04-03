import { InfoBlock } from "./info-block";
import { useGetModel } from "@/hooks/model/use-get-model";

function ModelAddressInfoTab({ modelId }: { modelId: string }) {
  const {model } = useGetModel({modelId});

  return (
    <div className="space-y-4">
      <InfoBlock label="Address" value={model.address} />
      <InfoBlock label="City" value={model.city} />
      <InfoBlock label="Region" value={model.region} />
      <InfoBlock label="Zip Code" value={model.zipCode} />
      <InfoBlock label="Country" value={model.country} />
    </div>
  );
}

export default ModelAddressInfoTab
