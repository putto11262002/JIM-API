import Link from "next/link";
import { Model, PaginatedData } from "@jimmodel/shared";
import _, { last } from "lodash";
import ModelGrid from "./model-grid";
import BreadCrumb from "../../../components/breadcrumb";

function getTagLabel(tag: string) {
  return _.upperFirst(tag.replace("-", " "));
}

async function getModels() {
  const res = await fetch(`${process.env.API_BASE_URL}/models/public`, {});

  if (!res.ok) {
    throw new Error("'Failed to load models");
  }

  const paginatedModel = await res.json();

  return paginatedModel as PaginatedData<Model>;
}

async function ModelPage({ params: { tags } }: { params: { tags: string[] } }) {
  const { data } = await getModels();

  const gender = tags?.[0]
  const tag = tags?.[1]
  return (
    <div className="container py-3 ">
      <BreadCrumb
        path={[
          { label: "Models", href: "/model" },
          ...(gender
            ? [{ label: _.upperFirst(gender), href: `/model/${gender}` }]
            : []),
          ...(tag
            ? [{ label: _.upperFirst(tag.replace("-", " ")), href: `/model/${gender}/${tag}` }]
            : []),
        ]}
      />

      <div className="mt-4">
        <ModelGrid models={data} />
      </div>
    </div>
  );
}

export default ModelPage;
