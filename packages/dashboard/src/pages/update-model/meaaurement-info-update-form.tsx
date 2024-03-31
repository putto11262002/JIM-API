import LoaderBlock from "../../components/shared/loader-block";
import useGetModel from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";
import { ModelMeausrementForm } from "../../components/model/measurement-form";

export default function ModelMeasurementInfoUpdateForm({
  id,
}: {
  id: string;
}) {
  const { model, isPending } = useGetModel({
    id
  });
  const { update } = useUpdateModel();

  if (isPending || !model) {
    return <LoaderBlock message="Loading model data" />;
  }

  return (
    <ModelMeausrementForm
      onSubmit={(data) => update({ id, input: data })}
      initialData={model}
    />
  );
}
