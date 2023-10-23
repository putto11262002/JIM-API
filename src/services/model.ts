export interface IModelService {
    createModel: () => any;
}

class ModelService implements IModelService {
    public async createModel(): Promise<void> {
        console.log("createModel");
    }
}

export default ModelService;
