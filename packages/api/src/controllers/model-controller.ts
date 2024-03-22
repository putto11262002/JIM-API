import express from "express";
import * as pgk from "@prisma/client";
import { prisma } from "../prisma";
import NotFoundError from "../lib/errors/not-found-error";
import { extractSingleFilesFromRequest } from "../lib/request";
import localFileService from "../services/local-file-service";
import { Model } from "@jimmodel/shared";
import {
  DecodeGetModelQuerySchema,
  ModelUpdateSchema,
  PaginatedData,
  ModelExperienceCreateSchema,
  CreateModelImageSchema,
  ModelCreateSchema,
} from "@jimmodel/shared";
import modelService from "../services/model-service";
import { validate } from "../lib/validation";
interface IModelController {
  createModel: express.Handler;
  updateModel: express.Handler;
  addModelExperience: express.Handler;
  removeModelExperience: express.Handler;
  addModelImage: express.Handler;
  removeModelImage: express.Handler;
  getModels: express.Handler;
  getModel: express.Handler;
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

    const where: pgk.Prisma.ModelWhereInput = {};

    if (query !== undefined) {
      if (query.q !== undefined) {
        where.OR = [
          {
            firstName: {
              contains: query.q,
            },
          },
          {
            lastName: {
              contains: query.q,
            },
          },
        ];
      }
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [models, total] = await Promise.all([
      prisma.model.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        include: {
          experiences: true,
          images: true,
        },
        orderBy: query.order,
      }),
      prisma.model.count({ where }),
    ]);

    const paginatedModel: PaginatedData<Model> = {
      data: models,
      total,
      page,
      pageSize,
      totalPage: Math.ceil(total / pageSize),
      hasNextPage: total > page * pageSize,
      hasPreviousPage: page > 1,
    };

    return res.json(paginatedModel);
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
        images: true,
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

const modelController: IModelController = {
  getModels,
  createModel,
  updateModel,
  addModelExperience,
  removeModelExperience,
  addModelImage,
  removeModelImage,
  getModel,
};

export default modelController;
