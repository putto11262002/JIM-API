import { ModelAddressForm } from "../../components/model/address-form";
import LoaderBlock from "../../components/shared/loader-block";
import useGetModel from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";

export default function ModelAddressInfoUpdateForm({ id }: { id: string }) {
  const { model, isPending } = useGetModel({ id });

  const { update } = useUpdateModel();
  if (isPending || !model) {
    return <LoaderBlock message="Loading model data" />;
  }
  return <ModelAddressForm onSubmit={(data) => update({ id, input: data })} initialData={model} />;
}