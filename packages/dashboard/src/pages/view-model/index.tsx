import modelService from "../../services/model";
import { getAppError } from "../../lib/error";
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

function ModelCard({ model }: { model: Model }) {
  return (
    <div className="rounded-sm shadow-md overflow-hidden">
      <div className="h-[20em] overflow-hidden relative">
        {model.images?.[0] ? (
          <img
            className="object-cover h-full w-full "
            src={model?.images?.[0]?.url}
            alt={model.nickname || "Model"}
          />
        ) : (
          <div className="absolute inset-0 bg-slate-300 text-white text-[10em] flex justify-center items-center">
            {model.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="px-4 py-2 ">
        <p className="font-medium text-nowrap truncate ...">
          {model.firstName} {model.lastName}
        </p>
        <p className="text-sm text-muted-foreground text-nowrap truncate ...">
          {model.email}
        </p>
      </div>

      <div className="px-4 py-2 pb-4 space-x-3">
        <Link to={`/models/${model.id}`}>
          <Button size="sm" variant="outline">
            View
          </Button>
        </Link>
        <Link to={`/models/${model.id}/update`}>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ModelGrid({ models }: { models: Model[] }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3 ">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </>
  );
}

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
