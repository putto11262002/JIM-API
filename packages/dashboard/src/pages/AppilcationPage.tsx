import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import ApplicationTable from "../components/applications/ApplicationTable";
import { useGetApplications } from "../hooks/application/useGetApplications";
import { useState } from "react";
import {
  ModelApplicationGetQuery,
  ModelApplicationStatus,
} from "@jimmodel/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import _ from "lodash";
import { Link } from "react-router-dom";
const pageSize = 10;
function AppilcationPage() {
  const [query, setQuery] = useState<ModelApplicationGetQuery>({
    status: ModelApplicationStatus.PENDING,
  });
  const [page, setPage] = useState<number>(1);
  const { data, isPending, error } = useGetApplications({
    query: { ...query, page, pageSize },
  });

  function handlePageChange(page: number) {
    if (page < 1 || page > (data?.totalPage ?? 0)) return;
    setPage(page);
  }
  return (
    <>
      <div className="flex justify-between py-3">
        <div className="w-1/5">
          <Select
            onValueChange={(value) => {
              setQuery((prevQuery) => ({
                ...prevQuery,
                status: value as ModelApplicationStatus,
              }));
              setPage(1);
            }}
            value={query.status}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ModelApplicationStatus).map((status) => {
                return (
                  <SelectItem key={status} value={status}>
                    {_.upperFirst(_.toLower(status))}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Link to={"/model-applications/submit"}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Application
          </Button>
        </Link>
      </div>

      <div className="py-3">
        <ApplicationTable
          error={error}
          onPageChange={handlePageChange}
          data={data?.data ?? []}
          isLoading={isPending}
          pagination={{ page, pageSize, totalPage: data?.totalPage ?? 0 }}
        />
      </div>
    </>
  );
}

export default AppilcationPage;
