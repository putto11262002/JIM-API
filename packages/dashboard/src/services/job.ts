import {
  BookingCreateInput,
  Job,
  JobCreateInput,
  JobGetQuery,
  JobStatus,
  JobUpdateInput,
  PaginatedData,
} from "@jimmodel/shared";
import { GenericAbortSignal } from "axios";
import axiosClient from "../lib/axios";

async function create(jobInput: JobCreateInput) {
  const res = await axiosClient.post("/jobs", jobInput);
  return res.data as Job;
}

async function getAll({
  query,
  signal,
}: {
  query: JobGetQuery;
  signal?: GenericAbortSignal;
}) {
  const res = await axiosClient.get("/jobs", { params: query, signal });
  return res.data as PaginatedData<Job>;
}

async function getById({
  id,
  signal,
}: {
  id: string;
  signal?: GenericAbortSignal;
}) {
  const res = await axiosClient.get(`/jobs/${id}`, { signal });
  return res.data as Job;
}

async function updateById({
  id,
  input,
  signal,
}: {
  id: string;
  input: JobUpdateInput;
  signal?: GenericAbortSignal;
}) {
  await axiosClient.put(`/jobs/${id}`, input, { signal });
}

async function addModel({
  id,
  modelId,
  signal,
}: {
  id: string;
  modelId: string;
  signal?: GenericAbortSignal;
}) {
  await axiosClient.post(`/jobs/${id}/models`, { modelId }, { signal });
}

async function removeModel({
  id,
  modelId,
  signal,
}: {
  id: string;
  modelId: string;
  signal?: GenericAbortSignal;
}) {
  await axiosClient.delete(`/jobs/${id}/models/${modelId}`, { signal });
}

async function addBooking({
  id,
  bookingInput,
  signal,
}: {
  id: string;
  bookingInput: BookingCreateInput;
  signal?: GenericAbortSignal;
}) {
  await axiosClient.post(`/jobs/${id}/bookings`, bookingInput, { signal });
}

async function removeBooking({
  bookingId,
  signal,
}: {
  bookingId: string;
  signal?: GenericAbortSignal;
}) {
  await axiosClient.delete(`/jobs/bookings/${bookingId}`, { signal });
}

async function confirm({
  id,
  signal,
}: {
  id: string;
  signal?: GenericAbortSignal;
}) {
  await axiosClient.put(
    `/jobs/${id}`,
    { status: JobStatus.CONFIRMED },
    { signal }
  );
}

async function archive({
  id,
  signal,
}: {
  id: string;
  signal?: GenericAbortSignal;
}) {
  await axiosClient.put(
    `/jobs/${id}`,
    { status: JobStatus.ARCHIVED },
    { signal }
  );
}
const jobService = {
  create,
  getAll,
  getById,
  updateById,
  addModel,
  removeModel,
  addBooking,
  removeBooking,
  confirm,
  archive,
};

export default jobService;
