import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import ApplicationTable from "../components/applications/ApplicationTable";
import { useGetApplications } from "../hooks/application/use-get-applications";
import {
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
import LoaderBlock from "../components/shared/loader-block";
import ErrorBlock from "../components/shared/error-block";
import Pagination from "../components/shared/pagination";

function AppilcationPage() {
  const {data, updateQuery, query, status, page, totalPage, prevPage, nextPage} = useGetApplications();
  return (
    <>
      <div className="flex justify-between py-3">
        <div className="w-1/5">
          <Select
            onValueChange={(value) => {
              updateQuery((prevQuery) => ({
                ...prevQuery,
                status: value as ModelApplicationStatus,
              }));
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

      {
        status === "pending" ? (
          <LoaderBlock/>
        ) : status === "error" ? (
         <ErrorBlock/>
        ) : (
          <>
          <ApplicationTable className="mt-3" data={data} />
        {totalPage > 1 &&  <Pagination className="mt-3 flex justify-end" page={page} totalPage={totalPage} prevPage={prevPage} nextPage={nextPage} />}
          </>
        )
      }
    </>
  );
}

export default AppilcationPage;
