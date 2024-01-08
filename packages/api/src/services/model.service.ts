import { inject, injectable } from "inversify";
import type {
    CreateModelExperienceInput,
    CreateModelImage,
    CreateModelInput,
    Model,
    ModelQuery,
    UpdateModelInput,
} from "../types/model";
import type { PaginatedData } from "../types/paginated-data";
import { Prisma, PrismaClient } from "@prisma/client";
import { TYPES } from "../inversify.config";
import { InvalidArgumentError } from "../utils/errors/invalid-argument.error";
import ConstraintViolationError from "../utils/errors/conflict.error";

export interface IModelService {
    /**
     * Create a new model
     * @param model
     * @returns Created model
     */
    createModel: (model: CreateModelInput) => Promise<Model>;

    /**
     * Get a model by id. If model does not exist, return null
     * @param id
     * @returns model or null
     */
    getModelById: (id: string) => Promise<Model | null>;

    /**
     * Get paginated models that match the query
     * @param query
     * @returns Paginated models
     */
    getModels: (query: ModelQuery) => Promise<PaginatedData<Model>>;

    /**
     *
     * @param modelId
     * @param experience
     * @returns
     */
    addModelExperience: (
        modelId: string,
        experience: CreateModelExperienceInput
    ) => Promise<void>;

    removeModelExperience: (
        modelId: string,
        experienceId: string
    ) => Promise<void>;

    addModelImage: (modelId: string, image: CreateModelImage) => Promise<void>;

    removeModelImage: (modelId: string, imageId: string) => Promise<void>;

    setModelProfileImage: (modelId: string, imageId: string) => Promise<void>;

    removeModel: (modelId: string) => Promise<void>;

    updateModel: (modelId: string, model: UpdateModelInput) => Promise<Model>;
}

@injectable()
export class ModelService implements IModelService {
    @inject(TYPES.PRISMA)
    private readonly prisma!: PrismaClient;

    public async createModel(model: CreateModelInput): Promise<Model> {
        const savedModel = await this.prisma.model.create({
            data: {
                ...model,
                experiences: {
                    create: model.experiences ?? [],
                },
                images: {
                    create: model.images ?? [],
                },
            },
        });
        return savedModel;
    }

    public async getModelById(id: string): Promise<Model | null> {
        const model = await this.prisma.model.findUnique({
            where: { id },
            include: {
                images: {
                    where: {
                        type: "profile_image",
                    },
                },
            },
        });

        return model;
    }

    public async getModels(query: ModelQuery): Promise<PaginatedData<Model>> {
        const where: Prisma.ModelWhereInput = {};

        if (typeof query.q !== "undefined") {
            where.OR = [
                {
                    firstName: {
                        startsWith: query.q,
                        mode: "insensitive",
                    },
                },
                {
                    lastName: {
                        startsWith: query.q,
                        mode: "insensitive",
                    },
                },
            ];
        }

        let sortBy;
        if (typeof query.sortBy !== "undefined") {
            sortBy =
                query.sortBy in Prisma.ModelScalarFieldEnum
                    ? query.sortBy
                    : Prisma.ModelScalarFieldEnum.updatedAt;
        }
        sortBy = sortBy ?? Prisma.ModelScalarFieldEnum.updatedAt;
        const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;

        const [models, total] = await Promise.all([
            this.prisma.model.findMany({
                where,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    images: {
                        where: {
                            type: "profile_image",
                        },
                    },
                },
            }),
            this.prisma.model.count({ where }),
        ]);

        const paginatedModel: PaginatedData<Model> = {
            data: models,
            total,
            totalPage: Math.ceil(total / pageSize),
            hasNextPage: page * pageSize < total,
            hasPreviousPage: page > 1,
            page,
            pageSize,
        };

        return paginatedModel;
    }

    public async addModelExperience(
        modelId: string,
        experience: CreateModelExperienceInput
    ): Promise<void> {
        await this.prisma.model.update({
            where: { id: modelId },
            data: {
                experiences: {
                    create: [experience],
                },
            },
        });
    }

    public async removeModelExperience(
        modelId: string,
        experienceId: string
    ): Promise<void> {
        await this.prisma.model.update({
            where: { id: modelId },
            data: {
                experiences: {
                    delete: {
                        id: experienceId,
                    },
                },
            },
        });
    }

    public async addModelImage(
        modelId: string,
        image: CreateModelImage
    ): Promise<void> {
        // Retrieve model and the associated profile image
        const model = await this.prisma.model.findFirst({
            where: { id: modelId },
            include: { images: { where: { type: "profile_image" } } },
        });

        // If model does not exist, throw error
        if (model === null) {
            throw new InvalidArgumentError("Model does not exist");
        }

        // Check if model already has a profile image
        // If model does not have a profile image, set the image type to profile image
        if (model.images.length < 0) {
            image.type = "profile_image";
        }

        await this.prisma.modelImage.create({
            data: {
                ...image,
                model: {
                    connect: { id: modelId },
                },
            },
        });
    }

    public async removeModelImage(
        modelId: string,
        imageId: string
    ): Promise<void> {
        const model = await this.prisma.model.findFirst({
            where: { id: modelId },
            include: { images: true },
        });

        if (model === null) {
            throw new InvalidArgumentError("Model does not exist");
        }

        // Check if the image to be deleted exist
        const imageToDelete = model.images.find(
            (image) => image.id === imageId
        );
        if (typeof imageToDelete === "undefined") {
            throw new InvalidArgumentError("Image does not exist");
        }

        // Check if the image to be deleted is the profile image
        const isProfileImage = imageToDelete?.type === "profile_image";

        // Throw an error if the image to be deleted is the profile image and the model only has one image
        if (isProfileImage && model.images.length < 2) {
            throw new ConstraintViolationError(
                "Please upload another image before deleting this image"
            );
        }

        await this.prisma.$transaction([
            // If the image to be deleted is the profile image and the model has more than one image, set the other image as the profile image before deleting the image
            ...(isProfileImage && model.images.length > 1
                ? [
                      this.prisma.modelImage.update({
                          where: {
                              id: model.images.find(
                                  (image) => image.id !== imageId
                              )?.id,
                          },
                          data: {
                              type: "profile_image",
                          },
                      }),
                  ]
                : []),
            this.prisma.modelImage.delete({ where: { id: imageId } }),
        ]);
    }

    public async setModelProfileImage(
        modelId: string,
        imageId: string
    ): Promise<void> {
        const model = await this.prisma.model.findFirst({
            where: { id: modelId },
            include: { images: { where: { id: imageId } } },
        });

        if (model === null) {
            throw new InvalidArgumentError("Model does not exist");
        }

        // Check if the image exist
        if (model.images.length < 1) {
            throw new InvalidArgumentError("Image does not exist");
        }

        // If the image is already the profile image, do nothing
        if (model.images[0].type === "profile_image") {
            return;
        }

        await this.prisma.$transaction([
            this.prisma.modelImage.updateMany({
                where: { modelId, type: "profile_image" },
                data: { type: "image" },
            }),
            this.prisma.modelImage.update({
                where: { id: imageId },
                data: { type: "profile_image" },
            }),
        ]);
    }

    public async removeModel(modelId: string): Promise<void> {
        await this.prisma.model.delete({ where: { id: modelId } });
    }

    public async updateModel(
        modelId: string,
        model: UpdateModelInput
    ): Promise<Model> {
        const updatedModel = await this.prisma.model.update({
            where: { id: modelId },
            data: { ...model, measurements: { update: model.measurements } },
        });
        return updatedModel;
    }
}

export default ModelService;
