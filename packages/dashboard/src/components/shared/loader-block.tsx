import { Loader2 } from "lucide-react";

function LoaderBlock({message}: {message?: string}){
    return <div className="flex justify-center flex-col items-center space-y-2">
    <Loader2 className="animate-spin" />
    <p>{message ? message : "Loading..."}</p>
    </div>
}

export default LoaderBlock