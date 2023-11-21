import { injectable } from "inversify";

export interface IModelService {
    createModel: () => any;
}

@injectable()
class ModelService implements IModelService {
    public async createModel(): Promise<void> {}
}

export default ModelService;
