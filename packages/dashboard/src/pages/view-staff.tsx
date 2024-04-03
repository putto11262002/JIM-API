import { Input } from "../components/ui/input";
import {
  StaffGetQuery,
  StaffRole,
  StaffWithoutSecrets,
} from "@jimmodel/shared";
import AddStaffDialog from "../components/staffs/add-staff-dialog";
import StaffTable from "../components/staffs/staff-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAppPaginatedQuery } from "../lib/react-query-wrapper/use-app-paginated-query";
import staffService from "../services/auth";
import LoaderBlock from "../components/shared/loader-block";
import ErrorBlock from "../components/shared/error-block";
import Pagination from "../components/shared/pagination";


export default function ViewStaffPage() {
  const { updateQuery, page, nextPage, prevPage, data, status, totalPage } =
    useAppPaginatedQuery<
      StaffWithoutSecrets,
      { signal?: AbortSignal; query: StaffGetQuery },
      StaffGetQuery
    >({
      queryFn: staffService.getAll,
      key: ["staffs"],
      arg: {},
      initialQuery: {},
    });

  return (
    <>
      <div className="flex justify-between py-2 gap-3">
        <div className="flex gap-3 grow">
          <Input
            onChange={(e) => {
              updateQuery((prevQuery) => ({ ...prevQuery, q: e.target.value }));
            }}
            placeholder="Name, Email..."
            className="w-2/5"
          />

          <Select
            onValueChange={(value) => {
              updateQuery((prevQuery) => ({
                ...prevQuery,
                ...(value === "*"
                  ? { roles: undefined }
                  : { roles: [value as StaffRole] }),
              }));
            }}
          >
            <SelectTrigger className="w-1/5" defaultValue={"*"}>
              <SelectValue placeholder="Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All</SelectItem>
              {Object.values(StaffRole).map((role) => (
                <SelectItem value={role} key={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <AddStaffDialog />
        </div>
      </div>
      <div className="py-4">
        {status === "pending" ? (
          <LoaderBlock />
        ) : status === "error" ? (
          <ErrorBlock />
        ) : (
          <>
            <StaffTable data={data || []} />
            {totalPage > 1 && (
              <div className="mt-3">
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
