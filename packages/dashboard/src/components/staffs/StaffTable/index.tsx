import { ColumnDef } from "@tanstack/react-table";
import { StaffWithoutSecrets } from "@jimmodel/shared";
import { DataTable } from "../../shared/DataTable";
import { Button } from "../../ui/button";
import { MoreHorizontal } from "lucide-react";
import UpdateStaffDialog from "../UpdateStaffDialog";
import { AppError } from "../../../types/app-error";

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
  data: StaffWithoutSecrets[];
  pagination: { page: number; pageSize: number; totalPage: number };
  onPageChange: (page: number) => void;
  isLoading?: boolean
  error: AppError | null
};

export default function StaffTable({
  data,
  pagination,
  onPageChange,
  isLoading = false,
  error
}: StaffTableProps) {
  return (
    <DataTable
    error={error}
    isLoading={isLoading}
      pagination={pagination}
      columns={columns}
      data={data}
      onPageChange={onPageChange}
    />
  );
}
