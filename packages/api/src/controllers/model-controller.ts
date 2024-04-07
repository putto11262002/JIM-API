import express from "express";
import * as pgk from "@prisma/client";
import { prisma } from "../prisma";
import NotFoundError from "../lib/errors/not-found-error";
import { extractSingleFilesFromRequest } from "../lib/request";
import localFileService from "../services/local-file-service";

import {
  DecodeGetModelQuerySchema,
  ModelUpdateSchema,
  PaginatedData,
  ModelExperienceCreateSchema,
  CreateModelImageSchema,
  ModelCreateSchema,
  Model,

} from "@jimmodel/shared";
import modelService from "../services/model-service";
import { validate } from "../lib/validation";
import { ACCEPTED_IMAGE_MIMETYPE } from "../lib/file-processors/image";

interface IModelController {
  createModel: express.Handler;
  updateModel: express.Handler;
  addModelExperience: express.Handler;
  removeModelExperience: express.Handler;
  addModelImage: express.Handler;
  removeModelImage: express.Handler;
  getModels: express.Handler;
  getModel: express.Handler;
  setModelProfileImage: express.Handler;
  getModelImages: express.Handler;
  getPublicModels: express.Handler
  getPublicModelById: express.Handler
}

async function createModel(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const modelPayload = validate(req.body, ModelCreateSchema);
    const savedModel = await modelService.create(modelPayload);

    return res.status(201).json(savedModel);
  } catch (err) {
    next(err);
  }
}

async function updateModel(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const modelPayload = validate(req.body, ModelUpdateSchema);

    const modelId = req.params.id;

    const updatedModel = await modelService.updateById(modelId, modelPayload);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function addModelExperience(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const modelId = req.params.id;

    const experiencePayload = validate(req.body, ModelExperienceCreateSchema);

    await modelService.addExperience(modelId, experiencePayload);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function removeModelExperience(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // const modelId = req.params.id;
    const experienceId = req.params.experienceId;

    const experience = await prisma.modelExperience.findUnique({
      where: {
        id: experienceId,
        //    modelId
      },
    });

    if (experience === null) {
      throw new NotFoundError("Experience not found");
    }

    await prisma.modelExperience.delete({
      where: {
        id: experienceId,
      },
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function addModelImage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const modelId = req.params.id;

    const modelImage = extractSingleFilesFromRequest(req, "image");
    if (modelImage === null) {
      throw new Error("Image found in the request");
    }

    if (!ACCEPTED_IMAGE_MIMETYPE.includes(modelImage.mimetype)){
      throw new Error("Invalid image format")
    }

    const { type } = validate(req.body, CreateModelImageSchema);

    await modelService.addImage(modelId, { image: modelImage, type });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function removeModelImage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // const modelId = req.params.id;
    const imageId = req.params.imageId;

    const image = await prisma.modelImage.findUnique({
      where: {
        id: imageId,
        // modelId
      },
    });

    if (image === null) {
      throw new NotFoundError("Image not found");
    }

    await prisma.modelImage.delete({
      where: {
        id: imageId,
      },
    });

    localFileService.deleteFile(image.fileId);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function getModels(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const query = validate(req.query, DecodeGetModelQuerySchema);

    const result = await modelService.getModels(query)

    return res.json(result);
  } catch (err) {
    next(err);
  }
}


async function getPublicModels(
  req: express.Request, 
  res: express.Response,
  next: express.NextFunction
){
  try{
    const query = validate(req.query, DecodeGetModelQuerySchema)
    const result = await modelService.getModels({...query, public: true})
    res.json(result)
  }catch(err){
    next(err)
  }
}

async function getPublicModelById(
  req: express.Request, 
  res: express.Response,
  next: express.NextFunction
){
  try {
    const modelId = req.params.id;

    const model = await prisma.model.findUnique({
      where: {
        id: modelId,
        public: true
      },
      include: {
        experiences: true,
        images: true
      },
    });

    if (model === null) {
      throw new NotFoundError("Model not found");
    }

    return res.json(model);
  } catch (err) {
    next(err);
  }
}

async function getModel(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const modelId = req.params.id;

    const model = await prisma.model.findUnique({
      where: {
        id: modelId,
      },
      include: {
        experiences: true,
        images: {
          orderBy: {
            profile: "desc",
          },
          take: 1
        },
      },
    });

    if (model === null) {
      throw new NotFoundError("Model not found");
    }

    return res.json(model);
  } catch (err) {
    next(err);
  }
}

async function setModelProfileImage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const imageId = req.params.imageId;

    const updatedImage = await prisma.modelImage.update({
      where: {
        id: imageId
      },
      data: {
        profile: true
      }
    })

    await prisma.modelImage.updateMany({
      where: {
        modelId: updatedImage.modelId,
        id: {
          not: imageId
        }
      },
      data: {
        profile: false
      }
    })

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}


async function getModelImages(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
){
  try{
    const modelId = req.params.id;
    const images = await prisma.modelImage.findMany({
      where: {
        modelId
      }
    })
    return res.json(images)
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
  getModel,
  setModelProfileImage,
  getModelImages,
  getPublicModels,
  getPublicModelById
};

export default modelController;
