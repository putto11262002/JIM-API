import { Model } from "@jimmodel/shared";
import Image from "next/image";
import Link from "next/link";
import ModelProfileImage from "../../../components/model-profile-image";

function ModelCard({ model }: { model: Model }) {
  const profile = model.images?.find((image) => image.profile);

  return (
   <Link href={`/model/profile/${model.id}`}>
    <div className="h-[25em] rounded-md overflow-hidden relative group">
      <div  className="group-hover:opacity-100 opacity-0 absolute inset-0 w-full h-full flex flex-col justify-center items-cetner bg-black/70 z-10 text-center">
        <h2 className="text-bold text-white text-lg ">{model.name}</h2>
      </div>
     
      {profile && <div className="h-full w-full bg-gray-200"></div>}
      <ModelProfileImage model={model}/>
    </div></Link>
  );
}

export default ModelCard;
