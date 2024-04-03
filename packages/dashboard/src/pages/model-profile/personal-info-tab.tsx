import dayjs from "dayjs";
import { InfoBlock } from "./info-block";
import { useGetModel } from "@/hooks/model/use-get-model";



 function ModelPersonalInfoTab({ modelId }: { modelId: string }) {
 const {data: model} = useGetModel({modelId})
  return (
    <div className="space-y-4">
      <InfoBlock label="Name" value={model.name} />
      <InfoBlock label="Nick Name" value={model.nickname} />
      <InfoBlock
        label="Date of Birth"
        value={dayjs(model.dateOfBirth).format("YYYY MM DD")}
      />
      <InfoBlock label="Gender" value={model.gender} />
      <InfoBlock label="Nationality" value={model.nationality} />
      <InfoBlock label="Ethnicity" value={model.ethnicity} />
      <InfoBlock
        label="Country of Residence"
        value={model.countryOfResidence}
      />
      <InfoBlock
        label="Spoken Languages"
        value={model.spokenLanguages?.join(", ")}
      />
      <InfoBlock label="Passport Number" value={model.passportNumber} />
      <InfoBlock label="ID Card Number" value={model.idCardNumber} />
      <InfoBlock label="Tax ID" value={model.taxId} />
    </div>
  );
}

export default ModelPersonalInfoTab
