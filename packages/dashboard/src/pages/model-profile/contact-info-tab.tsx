import { InfoBlock } from "./info-block";
import LoaderBlock from "@/components/shared/loader-block";
import useGetModel from "../../hooks/model/use-get-model";

export default function ModelContactInfoTab({ modelId }: { modelId: string }) {
  const { model, isPending } = useGetModel({ id: modelId });
  if (isPending || !model) {
    return <LoaderBlock message="Loading model data" />;
  }
  return (
    <div className="space-y-4">
      <InfoBlock label="Email" value={model.email} />
      <InfoBlock label="Phone Number" value={model.phoneNumber} />
      <InfoBlock label="Line ID" value={model.lineId} />
      <InfoBlock label="WhatsApp" value={model.whatsapp} />
      <InfoBlock label="WeChat" value={model.wechat} />
      <InfoBlock label="Instagram" value={model.instagram} />
      <InfoBlock label="Facebook" value={model.facebook} />
    </div>
  );
}

