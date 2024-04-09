import NotFoundError from "../lib/errors/not-found-error";
import {
  Model,
  ModelCreateInput,
  ModelExperienceCreateInput,
  ModelUpdateInput,
  ModelGetQuery,
  PaginatedData,
  ModelImageType,
} from "@jimmodel/shared";
import * as pgk from "@prisma/client";
import { prisma } from "../prisma";
import { ApplicationImage } from "./image";
import localFileService from "./file-service/local-file-service";
import { ModelImageUpdateTypeInput } from "@jimmodel/shared";

export interface IModelService {
  getById(id: string): Promise<Model>;
  create(modelInput: ModelCreateInput): Promise<Model>;
  updateById(modelId: string, modelInput: ModelUpdateInput): Promise<Model>;
  addImage(
    modelId: string,
    inpput: { image: ApplicationImage; type: string }
  ): Promise<void>;
  removeModelImage(imageId: string): Promise<void>;
  addExperience(
    modelId: string,
    experience: ModelExperienceCreateInput | ModelExperienceCreateInput[]
  ): Promise<void>;
  getModels(query: ModelGetQuery): Promise<PaginatedData<Model>>;
  updateModelImageType(imageId: string, input: ModelImageUpdateTypeInput): Promise<pgk.ModelImage>;
}

async function getById(id: string): Promise<Model> {
  const model = await prisma.model.findUnique({
    where: { id },
    include: modelInclude,
  });
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
    },
    include: modelInclude,
  });
  return model;
}

async function addImage(
  modelId: string,
  input: { image: ApplicationImage; type: ModelImageType }
): Promise<void> {
  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
  });
  if (model === null) {
    throw new NotFoundError("Model not found");
  }

  // Validate if the image conforms to the model image requirements

  await input.image.autoResize();
  await input.image.formatTo();

  const applicationFile = await localFileService.saveFileFromReadableStream(
    await input.image.getReadableStream(),
    `image/${input.image.format}`
  );

  await prisma.modelImage.create({
    data: {
      url: applicationFile.url,
      fileId: applicationFile.id,
      type: input.type,
      width: input.image.width,
      height: input.image.height,
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

async function getModels(query: ModelGetQuery) {
  const where: pgk.Prisma.ModelWhereInput = {};

  if (query !== undefined) {
    if (query.q !== undefined) {
      where.OR = [
        {
          name: {
            contains: query.q,
            mode: "insensitive",
          },
        },
        {
          nickname: {
            contains: query.q,
            mode: "insensitive",
          },
        },
      ];
    }

    if (query.public !== undefined) {
      where.public = query.public;
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
          take: 1,
        },
      },
      orderBy: { [query.orderBy ?? "createdAt"]: query.orderDir ?? "desc" },
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

  return paginatedModel;
}


async function updateModelImageType(imageId: string, input: ModelImageUpdateTypeInput){
  const image = await prisma.modelImage.update({
    where: {
      id: imageId,
    },
    data: {
      type: input.type,
    }
  })

  return image;
}

const modelService: IModelService = {
  getById,
  create,
  addImage,
  removeModelImage,
  addExperience,
  updateById,
  getModels,
  updateModelImageType
};

export default modelService;
