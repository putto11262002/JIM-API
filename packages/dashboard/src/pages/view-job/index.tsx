import { useQuery } from "@tanstack/react-query";
import JobTable from "../../components/job/job-table";
import { useState } from "react";
import { Job, JobGetQuery, PaginatedData } from "@jimmodel/shared";
import jobService from "../../services/job";
import staffService from "../../services/auth";
import { store } from "../../redux/store";
import { unauthenticate } from "../../redux/auth-reducer";
import { getAppError } from "../../lib/error";
import { AppError } from "../../types/app-error";

function ControlPanel() {
  return <div></div>;
}

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

function ViewJobPage() {
  const [query, setQuery] = useState<JobGetQuery>({ page: 1, pageSize: 10 });
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
    </>
  );
}

export default ViewJobPage;
