import NotFoundError from "../lib/errors/not-found-error";
import {
  Model,
  ModelCreateInput,
  FileMetaData,
  ModelExperienceCreateInput,
  ModelUpdateInput,
  ModelGetQuery,
  PaginatedData,
} from "@jimmodel/shared";
import * as pgk from "@prisma/client";
import { prisma } from "../prisma";
import localFileService, { ImageMetaData } from "./local-file-service";
export interface IModelService {
  getById(id: string): Promise<Model>;
  create(modelInput: ModelCreateInput): Promise<Model>;
  updateById(modelId: string, modelInput: ModelUpdateInput): Promise<Model>;
  addImage(
    modelId: string,
    image: { image: Express.Multer.File | ImageMetaData; type: string }
  ): Promise<void>;
  removeModelImage(imageId: string): Promise<void>;
  addExperience(
    modelId: string,
    experience: ModelExperienceCreateInput | ModelExperienceCreateInput[]
  ): Promise<void>;
  getModels(query: ModelGetQuery): Promise<PaginatedData<Model>>
}

async function getById(id: string): Promise<Model> {
  const model = await prisma.model.findUnique({ where: { id } });
  if (model === null) {
    throw new NotFoundError("Model not found");
  }
  return model;
}

const modelInclude = pgk.Prisma.validator<pgk.Prisma.ModelInclude>()({
  images: true,
  experiences: true,
});

async function create(modelInput: ModelCreateInput): Promise<Model> {
  const model = await prisma.model.create({
    data: {
      ...modelInput,
      name: modelInput.name || `${modelInput.firstName} ${modelInput.lastName}`,
    },
    include: modelInclude,
  });
  return model;
}

async function addImage(
  modelId: string,
  image: { image: Express.Multer.File | ImageMetaData; type: string }
): Promise<void> {
  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
  });
  if (model === null) {
    throw new NotFoundError("Model not found");
  }
  let savedImage: ImageMetaData;

  if ("originalname" in image.image) {
    savedImage = await localFileService.saveImage(image.image);
  } else {
    savedImage = image.image;
  }

  await prisma.modelImage.create({
    data: {
      url: savedImage.url,
      fileId: savedImage.id,
      type: image.type,
      width: savedImage.width,
      height: savedImage.height,
      model: {
        connect: {
          id: modelId,
        },
      },
    },
  });
}

async function updateById(
  modelId: string,
  modelInput: ModelUpdateInput
): Promise<Model> {
  const model = await prisma.model.findUnique({ where: { id: modelId } });

  if (model === null) {
    throw new NotFoundError("Model not found");
  }

  const updatedModel = await prisma.model.update({
    where: {
      id: modelId,
    },
    data: {
      ...modelInput,
      ...(modelInput.firstName !== undefined &&
      modelInput.lastName !== undefined
        ? { name: `${modelInput.firstName} ${modelInput.lastName}` }
        : {}),
    },
    include: modelInclude,
  });

  return updatedModel;
}

async function removeModelImage(imageId: string): Promise<void> {
  const image = await prisma.modelImage.findUnique({
    where: {
      id: imageId,
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
}

async function addExperience(
  modelId: string,
  experience: ModelExperienceCreateInput[] | ModelExperienceCreateInput
): Promise<void> {
  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
  });

  if (model === null) {
    throw new NotFoundError("Model not found");
  }

  if (!Array.isArray(experience)) {
    experience = [experience];
  }

  await prisma.modelExperience.createMany({
    data: experience.map((exp) => ({
      ...exp,
      modelId,
    })),
  });
}

async function getModels(
  query: ModelGetQuery
){
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

    if (query.public !== undefined){
      where.public = query.public
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
        images: {
          orderBy: {
            profile: "desc",
          },
          take: 1
        },
      },
      orderBy: {[query.orderBy ?? "createdAt"]: query.orderDir ?? "desc"},
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

  return paginatedModel
}

const modelService: IModelService = {
  getById,
  create,
  addImage,
  removeModelImage,
  addExperience,
  updateById,
  getModels
};

export default modelService;
