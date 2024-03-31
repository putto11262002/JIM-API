import { EncodedModelGetQuery, Model, PaginatedData } from "@jimmodel/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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

function useGetModel() {
  const [query, setQuery] = useState<
    EncodedModelGetQuery & { page: number; pageSize: number }
  >({
    page: 1,
    pageSize: 9,
    order: "createdAt:desc",
  });

  function _setQuery(
    newQuery: Omit<EncodedModelGetQuery, "page" | "pageSize">
  ) {
    setQuery({ ...query, ...newQuery, page: 1 });
  }

  function nextPage() {
    if (query.page >= (data?.totalPage ?? 0)) return;
    setQuery({ ...query, page: query.page + 1 });
  }

  function prevPage() {
    if (query.page <= 1) return;
    setQuery({ ...query, page: query.page - 1 });
  }
  const {
    isLoading,
    error: _error,
    data,
    isPending,
    isFetching,
  } = useQuery<PaginatedData<Model>>({
    queryKey: ["model", query],
    queryFn: ({ signal }) => modelService.getAll({ ...query }, signal),
  });
  return {
    setQuery: _setQuery,
    isLoading,
    error: _error ? getAppError(_error) : _error,
    data,
    isFetching,
    isPending,
    nextPage,
    prevPage,
    query,
  };
}

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
  const { setQuery, data, isLoading, error, prevPage, nextPage, query } =
    useGetModel();

  return (
    <>
      <div className="flex justify-between items-center py-2 gap-3">
        <div className="flex gap-2 grow justify-start">
          <Input
            onChange={(e) => setQuery({ ...query, q: e.target.value })}
            className="w-56"
            placeholder="Search by name, email..."
          />

          <Select
            onValueChange={(val) => setQuery({ ...query, order: val })}
            defaultValue={query.order}
          >
            <SelectTrigger className="w-48">
              <SelectValue className="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:asc">Lastest to oldest</SelectItem>
              <SelectItem value="createdAt:desc">Oldest to lastest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
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
        {isLoading ? (
          <LoaderBlock />
        ) : error ? (
          <ErrorBlock error={error} />
        ) : data && data.totalPage > 0 ? (
          <>
            <ModelGrid models={data?.data || []} />
            {data.totalPage > 1 && (
              <div className="mt-6 flex justify-end">
                <Pagination
                  page={data.page}
                  totalPage={data.totalPage}
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
