import modelService from "../../services/model";
import { Button } from "@components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Link } from "react-router-dom";
import LoaderBlock from "../../components/shared/loader-block";
import ErrorBlock from "../../components/shared/error-block";
import Pagination from "../../components/shared/pagination";
import { Model, ModelFields, ModelGetQuery, OrderDir } from "@jimmodel/shared";
import  {useAppPaginatedQuery} from "../../lib/react-query-wrapper/use-app-paginated-query";
import ModelGrid from "../../components/model/model-grid";




function ModelPage() {
  const initialQuery = {
    query: {
      q: "",
      orderBy: "createdAt",
      orderDir: "desc",
      page: 1,
      pageSize: 10,
    },
  };
  const { data, status, totalPage, nextPage, prevPage, updateQuery, error, page } =
    useAppPaginatedQuery<
      Model,
      { signal?: AbortSignal; query?: ModelGetQuery },
      ModelGetQuery
    >({
      queryFn: modelService.getAll,
      key: ["models"],
      initialQuery: {
        orderBy: "createdAt",
        orderDir: "desc",
        pageSize: 12
      },
      arg: {},
    });

  return (
    <>
      <div className="flex justify-between items-center py-2 gap-3">
        <div className="flex gap-2 grow justify-start">
          <Input
            onChange={(e) =>
              updateQuery((prevQuery) => ({ ...prevQuery, q: e.target.value }))
            }
            className="w-56"
            placeholder="Search by name, email..."
          />

          <Select
            onValueChange={(val) => {
              const [orderBy, orderDir] = val.split(":");
              updateQuery((prevQuery) => ({
                ...prevQuery, orderBy: orderBy as ModelFields, orderDir: orderDir as OrderDir
              }));
            }}
            defaultValue={`${initialQuery.query.orderBy}:${initialQuery.query.orderDir}`}
          >
            <SelectTrigger className="w-48">
              <SelectValue className="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={`${ModelFields.createdAt}:${OrderDir.ASC}`}>
                Lastest to oldest
              </SelectItem>
              <SelectItem value={`${ModelFields.createdAt}:${OrderDir.DESC}`}>
                Oldest to lastest
              </SelectItem>
              <SelectItem value={`${ModelFields.name}:${OrderDir.ASC}`}>
                Name
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Link to={"/models/add"}>
            <Button variant={"outline"}>
              <Plus className="w-4 h-4 mr-2" /> Model
            </Button>
          </Link>
        </div>
      </div>
      <div className="py-4">
        {status === "pending" ? (
          <LoaderBlock />
        ) : status === "error" ? (
          <ErrorBlock error={error?.message} />
        ) : data && totalPage > 0 ? (
          <>
            <ModelGrid models={data || []} />
            {totalPage > 1 && (
              <div className="mt-6 flex justify-end">
                <Pagination
                  page={page}
                  totalPage={totalPage}
                  nextPage={nextPage}
                  prevPage={prevPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center font-medium">No Result</div>
        )}
      </div>
    </>
  );
}

export default ModelPage;
