import { ColumnDef } from "@tanstack/react-table";
import { Job } from "@jimmodel/shared";
import _ from "lodash";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { JobDropdownMenu } from "./job-dropdown-menu";
import DataTable from "./data-table";
const columns: ColumnDef<Job>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "client", header: "Client" },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex">
        <div className="border border-slate-300 border-1 py-0.5 px-1.5 text-xs font-medium rounded-md ">
          {_.upperFirst(_.toLower(row.original.status))}
        </div>
      </div>
    ),
  },

  {
    id: "models",
    header: "Models",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate ... ">
        {row.original.models
          .map((model) => `${model.name}`)
          .join(", ")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <JobDropdownMenu job={row.original}>
          <Button variant="ghost" className="ml-auto" size={"sm"}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </JobDropdownMenu>
      );
    },
  },
];
function JobTable({
  data,
}: {
  data: Job[];
}) {
  return (
    <DataTable
      columns={columns}
      data={data || []}
    />
  );
}

export default JobTable;
