import { ModelExperienceForm } from "../../components/model/experience-form";
import LoaderBlock from "../../components/shared/loader-block";
import useAddExperience from "../../hooks/model/use-add-experience";
import useGetModel from "../../hooks/model/use-get-model";

export default function ExperienceUpdateForm({ id }: { id: string }) {
  const { model, isPending } = useGetModel({ id });
  const { addExperience } = useAddExperience();

  if (!model || isPending) {
    return <LoaderBlock message="Loading model data" />;
  }

  return (
    <ModelExperienceForm
      initialData={model.experiences}
      onAddExperience={(data) =>
        addExperience({ modelId: id, experience: data })
      }
    />
  );
}
