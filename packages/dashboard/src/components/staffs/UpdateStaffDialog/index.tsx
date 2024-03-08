import { StaffWithoutPassword } from "@jimmodel/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import UpdateStaffProfileForm from "./UpdateStaffProfileForm";
import UpdateStaffPasswordForm from "./UpdateStaffPasswordForm";
import { StaffService } from "../../../services/staff";


type UpdateStaffDialogProps = {
  staff: StaffWithoutPassword;
  children: React.ReactNode;
};



export default function UpdateStaffDialog({
  staff,
  children,
}: UpdateStaffDialogProps) {


  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
          <DialogDescription>Edit a staff details</DialogDescription>
        </DialogHeader>
        <div>
            <Tabs defaultValue="profile">
                <TabsList   className="">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <UpdateStaffProfileForm api={ (payload) => {
                     return StaffService.updateStaffById(staff.id, payload)
                    }} staff={staff}/>
                </TabsContent>
                <TabsContent value="password">
                    <UpdateStaffPasswordForm api={(payload) => {
                      return StaffService.updateStaffPasswordById(staff.id, payload)
                    }}/>
                </TabsContent>
            </Tabs>
        
        </div>
      </DialogContent>
    </Dialog>
  );
}
