import JobTable from "../../components/job/job-table";
import { Job, JobGetQuery, JobStatus } from "@jimmodel/shared";
import jobService from "../../services/job";

import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import CreateBlockDialog from "../../components/block/create-block-dialog";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useAppPaginatedQuery } from "../../lib/react-query-wrapper/use-app-paginated-query";
import Pagination from "../../components/shared/pagination";
import LoaderBlock from "../../components/shared/loader-block";
import ErrorBlock from "../../components/shared/error-block";

const jobStatusOptions: { label: string; value: string }[] = [
  {
    label: "Jobs",
    value: JobStatus.CONFIRMED,
  },
  {
    label: "Options",
    value: JobStatus.PENDING,
  },
  { label: "Archived", value: JobStatus.ARCHIVED },
];

function ViewJobPage() {


  const {
    data,
    updateQuery,
    query,
    page,
    nextPage,
    prevPage,
    totalPage,
    status,
  } = useAppPaginatedQuery<
    Job,
    { signal?: AbortSignal; query: JobGetQuery },
    JobGetQuery
  >({
    queryFn: jobService.getAll,
    key: ["jobs"],
    initialQuery: { pageSize: 5, status: JobStatus.CONFIRMED },
    arg: {},
  });

  return (
    <>
      {/* Control Section */}
      <div className="py-3 flex justify-between items-center">
        <div className="flex grow space-x-2">
          <div>
            <Input
              placeholder="Search by title, models, clients..."
              value={query.q}
              onChange={(e) =>
                updateQuery((prevQuery) => ({
                  ...prevQuery,
                  q: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Select
              defaultValue={query.status}
              onValueChange={(val) =>
                updateQuery((prevQuery) => ({ ...prevQuery, status: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {jobStatusOptions.map((status) => (
                  <SelectItem value={status.value} key={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-x-3">
          <Link to={"/jobs/add?status=confirmed"}>
            <Button variant={"outline"}>
              <Plus className="h-4 w-4 mr-2" />
              Job
            </Button>
          </Link>

          <Link to={"/jobs/add?status=pending"}>
            <Button variant={"outline"}>
              <Plus className="h-4 w-4 mr-2" />
              Option
            </Button>
          </Link>

          <CreateBlockDialog />
        </div>
      </div>

      {/* Job table */}
      <div className="py-3">
        {status === "pending" ? (
          <LoaderBlock />
        ) : status === "error" ? (
          <ErrorBlock />
        ) : (
          <>
            <JobTable data={data} />

            {totalPage > 2 && (
              <div className="flex justify-end mt-4">
                <Pagination
                  page={page}
                  prevPage={prevPage}
                  nextPage={nextPage}
                  totalPage={totalPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ViewJobPage;
