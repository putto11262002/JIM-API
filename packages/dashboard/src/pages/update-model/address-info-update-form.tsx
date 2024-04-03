import { ModelAddressForm } from "../../components/model/address-form";
import {useGetModel} from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";

function ModelAddressInfoUpdateForm({ id }: { id: string }) {
  const { model } = useGetModel({ modelId: id });

  const { update } = useUpdateModel();
 
  return (
    <ModelAddressForm
      onSubmit={(data) => update({ modelId: id, payload: data })}
      initialData={model}
    />
  );
}

export default ModelAddressInfoUpdateForm
