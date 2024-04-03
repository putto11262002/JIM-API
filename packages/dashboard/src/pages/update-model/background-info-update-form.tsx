import { ModelBackgroundForm } from "../../components/model/background-form";
import {useGetModel} from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";

function ModelBackgroundInfoUpdateForm({
  id
}: {
  id: string;
}) {
  const { model } = useGetModel({
    modelId: id
  });
  const { update } = useUpdateModel();


  return (
    <ModelBackgroundForm
      onSubmit={(data) => update({ modelId: id, payload: data })}
      initialData={model}
    />
  );
}

export default ModelBackgroundInfoUpdateForm