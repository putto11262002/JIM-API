import NotFoundError from "../lib/errors/not-found-error";
import { Model, ModelCreateInput, FileMetaData, ModelExperienceCreateInput } from "@jimmodel/shared";
import {prisma} from "../prisma";
import {  Prisma } from "@prisma/client";
import localFileService from "./local-file-service";
export interface IModelService {
    getById(id: string): Promise<Model>;
    create(modelInput: ModelCreateInput): Promise<Model>;
    addImage(modelId: string, image: {file: Express.Multer.File | FileMetaData, type: string}): Promise<void>
    removeModelImage(imageId: string): Promise<void>
    addExperience(modelId: string, experience: ModelExperienceCreateInput): Promise<void>
}

async function getById(id: string): Promise<Model> {
    const model = await prisma.model.findUnique({ where: { id } });
    if (model === null){
        throw new NotFoundError("Model not found")
    }
    return model;
}

const modelInclude = Prisma.validator<Prisma.ModelInclude>()({
    images: true,
    experiences: true,
    measurement: true
})

async function create(modelInput: ModelCreateInput): Promise<Model> {
    const model = await prisma.model.create({
        data: {
            ...modelInput,
            measurement: {
                create: modelInput.measurement
            },

        },
        include: modelInclude
    })
    return model;
}

async function addImage(modelId: string, image:{file:  Express.Multer.File | FileMetaData, type: string}): Promise<void> {
    const model = await prisma.model.findUnique({
        where: {
            id: modelId
        }
    })
    if (model === null){
        throw new NotFoundError("Model not found")
    }
    let savedImage: FileMetaData;

    if ('buffer' in image.file){
        savedImage = await localFileService.saveFile(image.file)
    }else{
        savedImage = image.file;
    }

    await prisma.modelImage.create({
        data: {
            url: savedImage.url,
            fileId: savedImage.id,
            type: image.type,
            model: {
                connect: {
                    id: modelId
                }
            },
            
        }
    })

}

async function removeModelImage(imageId: string): Promise<void>{
    const image = await prisma.modelImage.findUnique({
        where: {
            id: imageId
        }
    })

    if (image === null){
        throw new NotFoundError("Image not found")
    }

    await prisma.modelImage.delete({
        where: {
            id: imageId
        }
    })

    localFileService.deleteFile(image.fileId)
}

async function addExperience(modelId: string, experience: ModelExperienceCreateInput): Promise<void>{
    const model = await prisma.model.findUnique({
        where: {
            id: modelId
        }
    })

    if (model === null){
        throw new NotFoundError("Model not found")
    }

    await prisma.modelExperience.create({
        data: {
            ...experience,
            model: {
                connect: {
                    id: modelId
                }
            }
        }
    })
}


const modelService: IModelService = {
    getById,
    create,
    addImage,
    removeModelImage,
    addExperience
}

export default modelService;