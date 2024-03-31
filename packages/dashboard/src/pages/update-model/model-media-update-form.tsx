import MediaForm from "../../components/model/media-form";
import LoaderBlock from "../../components/shared/loader-block";
import useAddImage from "../../hooks/model/use-add-image";
import useGetModel from "../../hooks/model/use-get-model";

export default function ModelMediaUpdateForm({
  modelId,
  type,
}: {
  modelId: string;
  type: string;
}) {
  const { model, isPending } = useGetModel({ id: modelId });
  const { addImage } = useAddImage();
  if (isPending || !model) {
    return <LoaderBlock message="Loading model data" />;
  }

  return (
    <MediaForm
      type={type}
      onAddImage={({ image, type }) =>
        addImage({ id: modelId, imageCreateInput: { image, type } })
      }
      images={model?.images || []}
    />
  );
}
