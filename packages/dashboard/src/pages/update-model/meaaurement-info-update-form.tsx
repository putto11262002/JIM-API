import {useGetModel} from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";
import { ModelMeausrementForm } from "../../components/model/measurement-form";

function ModelMeasurementInfoUpdateForm({
   id,
}: {
  id: string;
}) {
  const { model } = useGetModel({
    modelId: id
  });
  const { update } = useUpdateModel();

  return (
    <ModelMeausrementForm
      onSubmit={(data) => update({ modelId: id, payload: data })}
      initialData={model}
    />
  );
}

export default ModelMeasurementInfoUpdateForm
