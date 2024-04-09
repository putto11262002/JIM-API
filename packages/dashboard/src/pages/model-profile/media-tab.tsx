import { useGetModelImage } from "@/hooks/model/use-get-model-images";
import { useState } from "react";
import { Gallery } from "react-grid-gallery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ModelImageType } from "../../types/model";
import { lowerCase, upperFirst } from "lodash";

function ModelMediaTab({ modelId }: { modelId: string }) {
  const { data } = useGetModelImage({ modelId });
  const [selectedType, setSelectedType] = useState<string>("*")
  const images = (selectedType ===  "*" ? data : data.filter((data) => data.type === selectedType)).map((data) => ({src: data.url, width: data.width, height: data.height}))
  return (
    <>
    <div className="">
      <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Filter by type"/>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={"*"}>All</SelectItem>
          {
            Object.values(ModelImageType).map((type) => (
              <SelectItem value={type} key={type}>{upperFirst(lowerCase(type))}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>

    </div>
      <div className="mt-3">
        

       {images.length > 0 ?  <Gallery
        enableImageSelection={false}
          images={images}
        /> : <p className="text-sm text-muted-foreground text-center">No media available</p>}
      </div>
    </>
  );
}

export default ModelMediaTab;
