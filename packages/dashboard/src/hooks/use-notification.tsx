import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

export default function useNotification(){
    const {toast} = useToast();

    function success(message: string){
        toast({
            description: (
              <div className="flex items-center">
                <CheckCircle className="text-success mr-4" />{" "}
                <p className="font-medium">{message}</p>
              </div>
            ),
            
          });
    }

    function error(message: string){
        toast({
            description: (
              <div className="flex items-center">
                <XCircle className="text-danger mr-4" />{" "}
                <p className="font-medium">{message}</p>
              </div>
            ),
          });
    }

    return {success, error}
}