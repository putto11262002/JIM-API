import { Model } from "@jimmodel/shared";
import Image from "next/image";
import ModelProfileImage from "../../../../components/model-profile-image";
import Gallery from "../../../../components/image-gallery";
import { Dot } from "lucide-react";
import MediaTab from "./media-tab";
import BreadCrumb from "../../../../components/breadcrumb";
import { ModelGenderLabel } from "../../../../data/model-constants";

async function getModel(modelId: string) {
  const res = await fetch(
    `${process.env.API_BASE_URL}/models/public/${modelId}`
  );
  if (!res.ok) {
    throw new Error("Fail to fetch model");
  }

  const model = await res.json();

  return model as Model;
}

async function ModelPage({ params: { id } }: { params: { id: string } }) {
  const model = await getModel(id);

  return (
    <div className="max-w-[700px] mx-auto container ">
    <div className="pt-3">
    <BreadCrumb path={[{label: "Models", href: "/model"}, {label: ModelGenderLabel[model.gender], href: `/model/${ModelGenderLabel[model.gender]}`}, {label: model.name, href: `/model/${model.id}`}]}/>
    </div>
      <div className="flex pt-8 w-full  ">
        <div>
          <div className="relative h-[12em] w-[8em] md:h-[15em] md:w-[10em] overflow-hidden">
            <ModelProfileImage model={model} />
          </div>
        </div>

        <div className="grow pl-5 md:pl-10">
          <h1 className=" font-bold mb-3">{model.name}</h1>

          <div className="flex flex-col gap-x-4 gap-y-2 flex-wrap text-sm">
            <p>
              Height <span className="text-muted-foreground">187CM</span>
            </p>
            <p>
              Hips <span className="text-muted-foreground">12</span>
            </p>
            <p>
              Waist <span className="text-muted-foreground">34</span>
            </p>
            <p>
              Eye Color <span className="text-muted-foreground">Black</span>
            </p>
            <p>
              Hair Color <span className="text-muted-foreground">White</span>
            </p>
          </div>
        </div>
      </div>
    <div className="pt-8">
    <MediaTab images={model.images}/>
    </div>
    </div>
  );
}

export default ModelPage;
