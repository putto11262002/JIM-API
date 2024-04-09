import MediaForm from "../../components/model/media-form";
import useAddImage from "../../hooks/model/use-add-image";
import { useGetModelImage } from "../../hooks/model/use-get-model-images";
import useRemoveImage from "../../hooks/model/use-remove-image";
import useSetProfileImage from "../../hooks/model/use-set-profile-image";

function ModelMediaUpdateForm({
  modelId,
}: {
  modelId: string;

}) {
  const { images } = useGetModelImage({ modelId: modelId });
  const { addImage } = useAddImage();
  const { removeImage } = useRemoveImage();
  const { setProfile } = useSetProfileImage();

  return (
    <MediaForm
      onSetProfileImage={({ imageId }) =>
        setProfile({ imageId })
      }
      onRemoveImage={({ imageId, modelId }) =>
        removeImage({ imageId, modelId })
      }
      onAddImage={({ image, type }) => {
        addImage({ modelId, modelImageCreateInput: { image, type } });
      }}
      images={images || []}
    />
  );
}


export default ModelMediaUpdateForm
