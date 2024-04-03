import { PersonalForm } from "../../components/model/personal-form";
import { useGetModel } from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";

function ModelPersonalInfoUpdateForm({ id }: { id: string }) {
  const { model } = useGetModel({ modelId: id });

  const { update } = useUpdateModel();

  return (
    <PersonalForm
      onSubmit={(data) => update({ modelId: id, payload: data })}
      initialData={model}
    />
  );
}

export default ModelPersonalInfoUpdateForm
