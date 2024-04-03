import ImageGallery from "../../components/shared/image-gallery";
import { useGetModelImage } from "@/hooks/model/use-get-model-images";


function ModelMediaTab({ modelId, type }: { modelId: string, type: string }) {
  const {data} = useGetModelImage({modelId})
  return (
    <>
      <div>
      <ImageGallery
            images={data.filter((image) => image.type == type) || []}
          />
      </div>
    </>
  );
}

export default ModelMediaTab

