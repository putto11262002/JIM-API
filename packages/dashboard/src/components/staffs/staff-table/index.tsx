import { ColumnDef } from "@tanstack/react-table";
import { StaffWithoutSecrets } from "@jimmodel/shared";
import DataTable from "../../job/data-table";
import { Button } from "../../ui/button";
import { MoreHorizontal } from "lucide-react";
import UpdateStaffDialog from "../update-staff-dialog";

const columns: ColumnDef<StaffWithoutSecrets>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
       <UpdateStaffDialog staffId={row.original.id}>
         <Button variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
       </UpdateStaffDialog>
      );
    },
  },
];

type StaffTableProps = {
  data: StaffWithoutSecrets[];
};

export default function StaffTable({
  data,
}: StaffTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
    />
  );
}
