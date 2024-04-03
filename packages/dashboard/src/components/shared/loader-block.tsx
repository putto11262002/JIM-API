import { Loader2 } from "lucide-react";

function LoaderBlock({message}: {message?: string}){
    return <div className="flex justify-center flex-col items-center s">
    <Loader2 className="animate-spin" />
 {message &&   <p className="font-medium mt-2">{message}</p>}
    </div>
}

export default LoaderBlock