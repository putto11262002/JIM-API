import { Link } from "react-router-dom";
import { Button } from "@components/ui/button";
import { Model } from "@jimmodel/shared";

export default function ModelCard({ model }: { model: Model }) {
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
          {model.name}
        </p>
        {/* <p className="text-sm text-muted-foreground text-nowrap truncate ...">
          {model.email}
        </p> */}
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