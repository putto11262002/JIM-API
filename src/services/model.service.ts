import { injectable } from "inversify";
import type {
    CreateModelExperienceInput,
    CreateModelInput,
    Model,
    ModelQuery,
    UpdateModelInput,
} from "../types/model";
import type { PaginatedData } from "../types/paginated-data";

export interface IModelService {
    createModel: (model: CreateModelInput) => Promise<Model>;
    getModelById: (id: string) => Promise<Model>;
    getModels: (query: ModelQuery) => Promise<PaginatedData<Model>>;
    addModelExperience: (
        modelId: string,
        experience: CreateModelExperienceInput
    ) => Promise<void>;
    removeModelExperience: (
        modelId: string,
        experienceId: string
    ) => Promise<void>;
    removeModel: (modelId: string) => Promise<void>;
    updateModel: (modelId: string, model: UpdateModelInput) => Promise<Model>;
}

@injectable()
class ModelService implements IModelService {
    public async createModel(model: CreateModelInput): Promise<Model> {
        throw new Error("Method not implemented.");
    }

    public async getModelById(id: string): Promise<Model> {
        throw new Error("Method not implemented.");
    }

    public async getModels(query: ModelQuery): Promise<PaginatedData<Model>> {
        throw new Error("Method not implemented.");
    }

    public async addModelExperience(
        modelId: string,
        experience: CreateModelExperienceInput
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async removeModelExperience(
        modelId: string,
        experienceId: string
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async removeModel(modelId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async updateModel(
        modelId: string,
        model: UpdateModelInput
    ): Promise<Model> {
        throw new Error("Method not implemented.");
    }
}

export default ModelService;
