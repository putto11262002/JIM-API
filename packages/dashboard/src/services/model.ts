import {
  EncodedModelGetQuery,
  Model,
  ModelCreateInput,
  ModelExperienceCreateInput,
  ModelUpdateInput,
  PaginatedData,
} from "@jimmodel/shared";
import { GenericAbortSignal } from "axios";
import axiosClient from "../lib/axios";

async function getAll(
  query?: EncodedModelGetQuery,
  signal?: GenericAbortSignal
) {
  const res = await axiosClient.get("/models", { params: query, signal });
  return res.data as PaginatedData<Model>;
}
async function getById({
  id,
  signal,
}: {
  id: string;
  signal?: GenericAbortSignal;
}) {
  const res = await axiosClient.get(`/models/${id}`, { signal });
  return res.data as Model;
}

async function create(model: ModelCreateInput, signal?: GenericAbortSignal) {
  const res = await axiosClient.post("/models", model, { signal });
  return res.data as Model;
}

async function updateById(modelId: string, payload: ModelUpdateInput) {
  await axiosClient.put(`/models/${modelId}`, payload);
}

async function addImage(
  modelId: string,
  modelImageCreateInput: { image: File; type: string }
) {
  const formData = new FormData();
  formData.append("image", modelImageCreateInput.image);
  formData.append("type", modelImageCreateInput.type);
  await axiosClient.post(`/models/${modelId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

async function addExperience(
  modelId: string,
  experience: ModelExperienceCreateInput | ModelExperienceCreateInput[]
) {
  await axiosClient.post(`/models/${modelId}/experiences`, experience);
}

const modelService = {
  getAll,
  getById,
  create,
  addImage,
  addExperience,
  updateById,
};

export default modelService;

