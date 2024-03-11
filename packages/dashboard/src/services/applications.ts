import { ModelApplication, ModelApplicationGetQuery, PaginatedData } from "@jimmodel/shared";
import axiosClient from "../lib/axios";
import { GenericAbortSignal } from "axios";

async function getAll(query: ModelApplicationGetQuery, signal?: GenericAbortSignal) {
    const res = await axiosClient.get("/model-applications", { params: query, signal });
    return res.data as PaginatedData<ModelApplication>;
}

async function getById(id: string, signal?: GenericAbortSignal) {
    const res = await axiosClient.get(`/model-applications/${id}`, { signal });
    return res.data as ModelApplication;
}

async function accept(id: string){
    const res = await axiosClient.post(`/model-applications/${id}/accept`);
    return res.data as ModelApplication;
}

async function archive(id: string){
    const res = await axiosClient.post(`/model-applications/${id}/archive`);
    return res.data as ModelApplication;
}

const modelApplicationService = {
    getAll,
    getById,
    accept,
    archive
}

export default modelApplicationService;