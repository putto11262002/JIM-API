import { useQuery } from "@tanstack/react-query";
import JobTable from "../../components/job/job-table";
import { useState } from "react";
import { Job, JobGetQuery, JobStatus, PaginatedData } from "@jimmodel/shared";
import jobService from "../../services/job";
import staffService from "../../services/auth";
import { store } from "../../redux/store";
import { unauthenticate } from "../../redux/auth-reducer";
import { getAppError } from "../../lib/error";
import { AppError } from "../../types/app-error";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import CreateBlockDialog from "../../components/block/create-block-dialog";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

// function ControlPanel() {
//   return <div></div>;
// }

export function errorInterceptor<T, K>(fn: (arg: T) => Promise<K>, arg: T) {
  try {
    return fn(arg);
  } catch (err) {
    const error = getAppError(err);
    if (error.statusCode === 401) {
      staffService.clearAccessToken();
      staffService.clearRefreshToken();
      store.dispatch(unauthenticate());
      return;
    }

    throw error;
  }
}

const jobStatusOptions: { label: string, value: string }[] = [
  {
    label: "Jobs",
    value: JobStatus.CONFIRMED
  },
  {
    label: "Options",
    value: JobStatus.PENDING
  },
  { label: "Archived", value: JobStatus.ARCHIVED },
]

function ViewJobPage() {
  const [query, setQuery] = useState<JobGetQuery>({ page: 1, pageSize: 10, status: JobStatus.CONFIRMED });
  const { data, isPending, error } = useQuery<
    unknown,
    AppError,
    PaginatedData<Job>
  >({
    queryKey: ["jobs", query],
    queryFn: ({ signal }) =>
      errorInterceptor(jobService.getAll, { query, signal }),
  });

  function handlePageChange(page: number) {
    if (page < 1 || page > (data?.totalPage ?? 0)) return;
    setQuery((prevQuery) => ({ ...prevQuery, page }));
  }

  return (
    <>
      {/* Control Section */}
      <div className="py-3 flex justify-between items-center">
        <div className="flex grow space-x-2">
          <div>
            <Input placeholder="Search by title, models, clients..." value={query.q} onChange={e => setQuery(prevQuery => ({ ...prevQuery, q: e.target.value }))} />
          </div>
          <div>
            <Select defaultValue={query.status} onValueChange={val => setQuery(prevQuery => ({ ...prevQuery, status: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {jobStatusOptions.map(status => (
                  <SelectItem value={status.value} key={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-x-3">
          <Link to={"/jobs/add"}>
            <Button variant={"outline"}>
              <Plus className="h-4 w-4 mr-2" />
              Job
            </Button>
          </Link>
          <CreateBlockDialog />
        </div>
      </div>

      {/* Job table */}
      <div className="py-3">
        <JobTable
          onPageChange={handlePageChange}
          isLoading={isPending}
          error={error}
          data={data?.data || []}
          pagination={{
            page: data?.page ?? 0,
            pageSize: data?.pageSize ?? 0,
            totalPage: data?.totalPage ?? 0,
          }}
        />
      </div>
    </>
  );
}

export default ViewJobPage;
