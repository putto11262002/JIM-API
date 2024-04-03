import { ModelExperienceForm } from "../../components/model/experience-form";
import useAddExperience from "../../hooks/model/use-add-experience";
import {useGetModel} from "../../hooks/model/use-get-model";

function ExperienceUpdateForm({ id }: { id: string }) {
  const { model } = useGetModel({ modelId: id });
  const { addExperience } = useAddExperience();

  return (
    <ModelExperienceForm
      initialData={model.experiences}
      onAddExperience={(data) =>
        addExperience({ modelId: id, experience: data })
      }
    />
  );
}


export default ExperienceUpdateForm
