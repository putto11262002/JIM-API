import express from "express"
import { CreateModelExperienceSchema, CreateModelImageSchema, CreateModelSchema, GetModelQuerySchema, UpdateModelSchema } from "../schemas/model-schema"
import { prisma } from "../prisma"
import NotFoundError from "../lib/errors/not-found-error"
import { extractSingleFilesFromRequest } from "../lib/request"
import localFileService from "../services/local-file-service"
import { Model, Prisma } from "@prisma/client"
import { PaginatedData } from "@jimmodel/shared"
import { zodErrorToValidationError } from "../lib/errors/validation-error"
interface IModelController {
    createModel: express.Handler
    updateModel: express.Handler
    addModelExperience: express.Handler
    removeModelExperience: express.Handler
    addModelImage: express.Handler
    removeModelImage: express.Handler
    getModels: express.Handler
    getModel: express.Handler
}

async function createModel(req: express.Request, res: express.Response, next: express.NextFunction) {
    try{

        const validation = CreateModelSchema.safeParse(req.body)
        if (!validation.success){
            throw zodErrorToValidationError(validation.error)
        }
        const modelPayload = validation.data;

        const savedModel = await prisma.model.create({
            data: {
                ...modelPayload,
                measurement: {
                    create: modelPayload.measurement
                }
            },
            include: {experiences: true, images: true, measurement: true}

        })

        return res.status(201).json(savedModel)
    }catch(err){
        next(err)
    }
}

async function updateModel(req: express.Request, res: express.Response, next: express.NextFunction) {
    try{
        const validation = UpdateModelSchema.safeParse(req.body)
        if (!validation.success){
            throw zodErrorToValidationError(validation.error)
        }
        const modelPayload = validation.data;

        const modelId = req.params.id;

        const model = await prisma.model.findUnique({
            where: {
                id: modelId
            },
            
        })

        if (model === null){
            throw new NotFoundError("Model not found")
        }

        await prisma.model.update({
            where: {
                id: modelId
            },
            data: {
                ...modelPayload,
                measurement: {
                    update: modelPayload.measurement
                }
            },
            include: {measurement: true}
        })

        return res.sendStatus(204)
    }catch(err){
        next(err)
    }
}

async function addModelExperience(req: express.Request, res: express.Response, next: express.NextFunction) {
    try{
        const modelId = req.params.id;

        const model = await prisma.model.findUnique({
            where: {
                id: modelId
            }
        })

        if (model === null){
            throw new NotFoundError("Model not found")
        }

        const validation = CreateModelExperienceSchema.safeParse(req.body)   
        if (!validation.success){
            throw zodErrorToValidationError(validation.error)
        }
        const experiencePayload = validation.data;

        await prisma.modelExperience.create({
            data: {
                ...experiencePayload,
                model: {
                    connect: {
                        id: modelId
                    }
                }
            }
        })

        return res.sendStatus(204)

    }catch(err){
        next(err)
    }
}

async function removeModelExperience(req: express.Request, res: express.Response, next: express.NextFunction) {
    try{
        // const modelId = req.params.id;
        const experienceId = req.params.experienceId;

        const experience = await prisma.modelExperience.findUnique({
            where: {
                id: experienceId,
            //    modelId
                
            },
        
        })


        if (experience === null){
            throw new NotFoundError("Experience not found")
        }

        await prisma.modelExperience.delete({
            where: {
                id: experienceId,
            },
        })

        return res.sendStatus(204)
    }catch(err){
        next(err)
    }
}

async function addModelImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    try{
        const modelId = req.params.id;

        const model = await prisma.model.findUnique({
            where: {
                id: modelId
            }
        })

        if (model === null){
            throw new NotFoundError("Model not found")
        }

        const modelImage = extractSingleFilesFromRequest(req, "image")
        if (modelImage === null){
            throw new Error("Image found in the request")
        }

        const validation = CreateModelImageSchema.safeParse(req.body)
        if (!validation.success){
            throw zodErrorToValidationError(validation.error)
        }
        const {type} = validation.data;

        const imageMetaData = await localFileService.saveFile(modelImage)

        await prisma.modelImage.create({
            data: {
                url: imageMetaData.url,
                type,
                fileId: imageMetaData.id,
                model: {
                    connect: {
                        id: modelId
                    }
                }
            }
        })

        return res.sendStatus(204)
    }catch(err){
        next(err)
    }
}

async function removeModelImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    try{
        // const modelId = req.params.id;
        const imageId = req.params.imageId;

        const image = await prisma.modelImage.findUnique({
            where: {
                id: imageId, 
                // modelId
            },
        })


        if (image === null){
            throw new NotFoundError("Image not found")
        }

        await prisma.modelImage.delete({
            where: {
                id: imageId,
            },
        })

        localFileService.deleteFile(image.fileId)

        return res.sendStatus(204)
    }catch(err){
        next(err)

    }
}


async function getModels(req: express.Request, res: express.Response, next: express.NextFunction) {
    try{
        const validation = GetModelQuerySchema.safeParse(req.query)
        if (!validation.success){
            throw zodErrorToValidationError(validation.error)
        }
        const query = validation.data;

        const where: Prisma.ModelWhereInput = {}

        if (query !== undefined){
            if (query.q !== undefined){
                where.OR = [
                    {
                        firstName: {
                            contains: query.q
                        }
                    },
                    {
                        lastName: {
                            contains: query.q
                        }
                    }
                ]
            }
        }

        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10

        
        const [models, total] = await Promise.all([
            prisma.model.findMany({
                where,
                take: pageSize,
                skip: (page - 1) * pageSize,
                include: {
                    measurement: true,
                    experiences: true,
                    images: true
                }
            }),
            prisma.model.count({where})
        ])

        const paginatedModel: PaginatedData<Model> = {
            data: models,
            total,
            page,
            pageSize,
            totalPage: Math.ceil(total / pageSize),
            hasNextPage: total > page * pageSize,
            hasPreviousPage: page > 1
        }

        return res.json(paginatedModel)
    }catch(err){
        next(err)
    }
}


async function getModel(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const modelId = req.params.id;

        const model = await prisma.model.findUnique({   
            where: {
                id: modelId
            },
            include: {
                measurement: true,
                experiences: true,
                images: true
            }
        })

        if (model === null){
            throw new NotFoundError("Model not found")
        }

        return res.json(model)
    }catch(err){
        next(err)
    }
}

const modelController: IModelController = {
    getModels,
    createModel,
    updateModel,
    addModelExperience,
    removeModelExperience,
    addModelImage,
    removeModelImage,
    getModel
}

export default modelController
