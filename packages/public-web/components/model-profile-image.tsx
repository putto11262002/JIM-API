import { Model } from "@jimmodel/shared";
import Image from "next/image";
function ModelProfileImage({model}: {model: Model}){
    const profile = model.images?.find(image => image.profile)
    return (
        <>
        {profile && (
            <Image
              fill
              src={profile.url}
              className="object-cover absolute"
              alt={model.name}
            />
          )}
          {profile && <div className="h-full w-full bg-gray-200"></div>}
          {!profile && (
            <div className="absolute inset-0 h-full w-full bg-gray-300 flex items-center justify-center text-3xl">
              {model.name.charAt(0)}
            </div>
          )}
          </>
    )
}

export default ModelProfileImage