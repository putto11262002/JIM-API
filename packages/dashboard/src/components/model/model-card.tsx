import { Link } from "react-router-dom";
import placeholderImage from "@assets/placeholder.jpeg";
import { Button } from "@components/ui/button";
import { Model } from "@jimmodel/shared";

export default function ModelCard({ model }: { model: Model }) {
  return (
    <div className="rounded-sm shadow-md overflow-hidden">
      <img
        className="object-cover h-[20em] "
        src={model?.images?.[0]?.url || placeholderImage}
        alt={model.nickname || "Model"}
      />

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
