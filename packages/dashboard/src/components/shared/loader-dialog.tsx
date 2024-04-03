import { AlertDialog, AlertDialogContent } from "@components/ui/alert-dialog"
import LoaderBlock from "./loader-block"

function LoaderDialog(){
    return (
      <AlertDialog open={true}>
        <AlertDialogContent className="w-[15em]">
          <LoaderBlock message="Loading staff data"/>
        </AlertDialogContent>
  
      </AlertDialog>
    )
  }

  export default LoaderDialog