import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import UpdateStaffProfileForm from "./staff-ptofile-update-form";
import UpdateStaffPasswordForm from "./staff-password-update-form";
import WithSuspense from "../../shared/with-suspense";
import { useState } from "react";
import LoaderDialog from "../../shared/loader-dialog";

type UpdateStaffDialogProps = {
  staffId: string;
  children: React.ReactNode;
};

function CustomeDialogContent({staffId}: {staffId: string}){
  
  return <DialogContent  className="max-h-[80vh] overflow-auto">
  <DialogHeader>
    <DialogTitle>Edit Staff</DialogTitle>
    <DialogDescription>Edit a staff details</DialogDescription>
  </DialogHeader>

  <div>
    <Tabs defaultValue="profile">
      <TabsList className="">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UpdateStaffProfileForm
          staffId={staffId}
        />
      </TabsContent>
      <TabsContent value="password">
        <UpdateStaffPasswordForm
         staffId={staffId}
        />
      </TabsContent>
    </Tabs>
  </div>
</DialogContent>

}


const SuspenseCustomeDialogContent = WithSuspense(CustomeDialogContent, undefined, LoaderDialog);

function UpdateStaffDialog({
  staffId,
  children,
}: UpdateStaffDialogProps) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
    {open &&  <SuspenseCustomeDialogContent staffId={staffId}/>}
    
    </Dialog>
  );
}




export default UpdateStaffDialog
