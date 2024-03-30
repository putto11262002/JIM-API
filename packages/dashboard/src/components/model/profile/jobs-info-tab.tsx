import { Job } from "@jimmodel/shared";
import DataTable from "../../job/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { JobDropdownMenu } from "../../job/job-dropdown-menu";
import { Button } from "../../ui/button";
import { MoreHorizontal } from "lucide-react";
import _ from "lodash";
const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
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
function ModelJobDataTable({ data }: { data: Job[] }) {
  return <DataTable data={data} columns={columns} />;
}
export default function ModelJobsInfoTab({ modelJobs }: { modelJobs: Job[] }) {
  return (
    <div>
      <div>
        <ModelJobDataTable data={modelJobs} />
      </div>
    </div>
  );
}
