import { InfoBlock } from "./shared";
import ExperienceTable from "../experience-table";
import LoaderBlock from "@/components/shared/loader-block";
import useGetModel from "../hooks/use-get-model";

export default function ModelBackgroundInfoTab({
  modelId,
}: {
  modelId: string;
}) {
  const { model, isPending } = useGetModel({ id: modelId });
  if (isPending || !model) {
    return <LoaderBlock message="Loading model data" />;
  }
  return (
    <div className="space-y-4">
      <InfoBlock label="Occupation" value={model.occupation} />
      <InfoBlock
        label="Highest Level of Education"
        value={model.highestLevelOfEducation}
      />
      <InfoBlock label="Medical Background" value={model.medicalBackground} />
      <InfoBlock label="About Me" value={model.aboutMe} />
      <InfoBlock label="Talents" value={model.talents.join(", ")} />
      <div>
        <p className="font-medium text-sm">Experiences</p>
        <ExperienceTable experiences={model.experiences} />
      </div>
    </div>
  );
}

