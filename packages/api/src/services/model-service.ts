import NotFoundError from "../lib/errors/not-found-error";
import {
  Model,
  ModelCreateInput,
  FileMetaData,
  ModelExperienceCreateInput,
  ModelUpdateInput,
} from "@jimmodel/shared";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import localFileService from "./local-file-service";
export interface IModelService {
  getById(id: string): Promise<Model>;
  create(modelInput: ModelCreateInput): Promise<Model>;
  updateById(modelId: string, modelInput: ModelUpdateInput): Promise<Model>;
  addImage(
    modelId: string,
    image: { image: Express.Multer.File | FileMetaData; type: string }
  ): Promise<void>;
  removeModelImage(imageId: string): Promise<void>;
  addExperience(
    modelId: string,
    experience: ModelExperienceCreateInput | ModelExperienceCreateInput[]
  ): Promise<void>;
}

async function getById(id: string): Promise<Model> {
  const model = await prisma.model.findUnique({ where: { id } });
  if (model === null) {
    throw new NotFoundError("Model not found");
  }
  return model;
}

const modelInclude = Prisma.validator<Prisma.ModelInclude>()({
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
  image: { image: Express.Multer.File | FileMetaData; type: string }
): Promise<void> {
  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
  });
  if (model === null) {
    throw new NotFoundError("Model not found");
  }
  let savedImage: FileMetaData;

  if ("originalname" in image.image) {
    savedImage = await localFileService.saveFile(image.image);
  } else {
    savedImage = image.image;
  }

  await prisma.modelImage.create({
    data: {
      url: savedImage.url,
      fileId: savedImage.id,
      type: image.type,
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

const modelService: IModelService = {
  getById,
  create,
  addImage,
  removeModelImage,
  addExperience,
  updateById,
};

export default modelService;
