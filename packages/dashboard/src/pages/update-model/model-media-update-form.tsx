import MediaForm from "../../components/model/media-form";
import LoaderBlock from "../../components/shared/loader-block";
import useAddImage from "../../hooks/model/use-add-image";
import useGetModelImages from "../../hooks/model/use-get-model-images";
import useRemoveImage from "../../hooks/model/use-remove-image";
import useSetProfileImage from "../../hooks/model/use-set-profile-image";

export default function ModelMediaUpdateForm({
  modelId,
  type,
}: {
  modelId: string;
  type: string;
}) {
  const { images, isPending } = useGetModelImages({ id: modelId });
  const { addImage } = useAddImage();
  const {removeImage} = useRemoveImage()
  const {setProfile} = useSetProfileImage()
  if (isPending || !images) {
    return <LoaderBlock message="Loading model data" />;
  }

  return (
    <MediaForm
    onSetProfileImage={({imageId, modelId}) => setProfile({imageId,modelId})}
    onRemoveImage={({imageId, modelId}) => removeImage({imageId,modelId })}
      type={type}
      onAddImage={({ image, type }) =>
        addImage({ id: modelId, imageCreateInput: { image, type } })
      }
      images={images || []}
    />
  );
}
