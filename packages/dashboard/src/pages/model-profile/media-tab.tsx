import ImageGallery from "../../components/shared/image-gallery";
import useGetModel from "../../hooks/model/use-get-model";
import LoaderBlock from "@/components/shared/loader-block";

export default function ModelMediaTab({ modelId, type }: { modelId: string, type: string }) {
  const { model, isPending } = useGetModel({ id: modelId });
 
  if (isPending || !model) {
    return <LoaderBlock message="Loading model data" />;
  }
  return (
    <>
      <div>
      <ImageGallery
            images={model?.images?.filter((image) => image.type == type) || []}
          />
      </div>
    </>
  );
}

