import NotFoundError from "../lib/errors/not-found-error";
import { Model } from "@jimmodel/shared";
import {prisma} from "../prisma";
export interface IModelService {
    getById(id: string): Promise<Model>;
}

async function getById(id: string): Promise<Model> {
    const model = await prisma.model.findUnique({ where: { id } });
    if (model === null){
        throw new NotFoundError("Model not found")
    }
    return model;
}



const modelService: IModelService = {
    getById
}

export default modelService;