import { ColumnDef } from "@tanstack/react-table";
import { StaffWithoutPassword } from "@jimmodel/shared";
import { DataTable } from "../../shared/DataTable";
import { Button } from "../../ui/button";
import { MoreHorizontal } from "lucide-react";
import UpdateStaffDialog from "../UpdateStaffDialog";

const columns: ColumnDef<StaffWithoutPassword>[] = [
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
      // const staff = row.original
      // console.log(staff)
      return (
       <UpdateStaffDialog staff={row.original}>
         <Button variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
       </UpdateStaffDialog>
      );
    },
  },
];

type StaffTableProps = {
  data: StaffWithoutPassword[];
  pagination: { page: number; pageSize: number; totalPage: number };
  onPageChange: (page: number) => void;
  isLoading?: boolean
};

export default function StaffTable({
  data,
  pagination,
  onPageChange,
  isLoading = false
}: StaffTableProps) {
  return (
    <DataTable
    isLoading={isLoading}
      pagination={pagination}
      columns={columns}
      data={data}
      onPageChange={onPageChange}
    />
  );
}
