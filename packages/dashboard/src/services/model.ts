import {

  Model,
  ModelCreateInput,
  ModelExperienceCreateInput,
  ModelGetQuery,
  ModelImage,
  ModelUpdateInput,
  PaginatedData,
} from "@jimmodel/shared";
import { GenericAbortSignal } from "axios";
import axiosClient from "../lib/axios";

async function getAll(
 {query, signal}: { query?: ModelGetQuery,
  signal?: AbortSignal}
) {
  const res = await axiosClient.get("/models", { params: query, signal });
  return res.data as PaginatedData<Model>;
}
async function getById({
  id,
  signal,
}: {
  id: string;
  signal?: AbortSignal;
}) {
  const res = await axiosClient.get(`/models/${id}`, { signal });
  return res.data as Model;
}

async function create(model: ModelCreateInput, signal?: GenericAbortSignal) {
  const res = await axiosClient.post("/models", model, { signal });
  return res.data as Model;
}

async function updateById({modelId, payload}:{modelId: string, payload: ModelUpdateInput}) {
  await axiosClient.put(`/models/${modelId}`, payload);
}

async function addImage(
 {modelId, modelImageCreateInput}: { modelId: string,
  modelImageCreateInput: { image: File; type: string }}
) {
  const formData = new FormData();
  formData.append("image", modelImageCreateInput.image);
  formData.append("type", modelImageCreateInput.type);
  await axiosClient.post(`/models/${modelId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}


async function removeImage({imageId, signal}: {imageId: string, signal?: GenericAbortSignal, modelId: string}) {
  await axiosClient.delete(`/models/images/${imageId}`, { signal });
}

async function addExperience(
  {modelId, experience}: {modelId: string,
  experience: ModelExperienceCreateInput | ModelExperienceCreateInput[]}
) {
  await axiosClient.post(`/models/${modelId}/experiences`, experience);
}

async function setProfileImage(
  {imageId}: {imageId: string}
){
  await axiosClient.put(`/models/images/${imageId}/profile`);
}

async function getImages({id, signal}: {id: string, signal?: GenericAbortSignal}){
  const res = await axiosClient.get(`/models/${id}/images`, {signal});
  return res.data as ModelImage[];
}

const modelService = {
  getAll,
  getById,
  create,
  addImage,
  addExperience,
  updateById,
  removeImage,
  setProfileImage,
  getImages
};

export default modelService;

