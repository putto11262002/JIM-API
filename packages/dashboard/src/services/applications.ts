import { ModelApplication, ModelApplicationCreateInput, ModelApplicationGetQuery, PaginatedData } from "@jimmodel/shared";
import axiosClient from "../lib/axios";

async function getAll({query, signal}: {query: ModelApplicationGetQuery, signal?: AbortSignal}) {
    const res = await axiosClient.get("/model-applications", { params: query, signal });
    return res.data as PaginatedData<ModelApplication>;
}

async function getById({id, signal}: {id: string, signal?: AbortSignal}) {
    const res = await axiosClient.get(`/model-applications/${id}`, { signal });
    return res.data as ModelApplication;
}

async function accept({id}:{id: string}){
    const res = await axiosClient.post(`/model-applications/${id}/accept`);
    return res.data as ModelApplication;
}

async function archive({id}: {id: string}){
    const res = await axiosClient.post(`/model-applications/${id}/archive`);
    return res.data as ModelApplication;
}

async function create({input}: {input: ModelApplicationCreateInput}){
    const res = await axiosClient.post(`/model-applications`, input);
    return res.data as ModelApplication;
}

async function addImages({id, images}: {id: string, images: File[]}){
    const formData = new FormData();
    images.forEach((image) => {
        formData.append("images", image);
    });
   await axiosClient.post(`/model-applications/${id}/images`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
   

}

const modelApplicationService = {
    getAll,
    getById,
    accept,
    archive,
    create,
    addImages
}

export default modelApplicationService;