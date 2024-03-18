import express from "express";
import {
  ModelApplicationCreateSchema,
  ModelApplicationQuerySchema,
} from "@jimmodel/shared";
import { prisma } from "../prisma";
import localFileService from "../services/local-file-service";
import {
  ModelApplication,
  ModelApplicationStatus,
  Prisma,
} from "@prisma/client";
import { PaginatedData } from "@jimmodel/shared";
import {
  extractFileFromRequest,
  extractSingleFilesFromRequest,
} from "../lib/request";
import NotFoundError from "../lib/errors/not-found-error";
import ConstraintViolationError from "../lib/errors/constraint-violation-error";
import ValidationError, {
  zodErrorToValidationError,
} from "../lib/errors/validation-error";
import { validate } from "../lib/validation";
import modelApplicationService from "../services/model-application-service";

export async function createModelApplicationController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const applicationPayload = validate(req.body, ModelApplicationCreateSchema);
    const savedModelApplication = await modelApplicationService.create(
      applicationPayload
    );
    res.status(201).json(savedModelApplication);
  } catch (err) {
    next(err);
  }
}

export async function addImageToModelApplicationController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const modelApplicationId = req.params.id;

    const images = extractFileFromRequest(req, "images");

    // const midlengthImage = extractSingleFilesFromRequest(req, "midlengthImage");
    // const fulllengthImage = extractSingleFilesFromRequest(
    //   req,
    //   "fulllengthImage"
    // );
    // const closeupImage = extractSingleFilesFromRequest(req, "closeupImage");

    // if (
    //   midlengthImage === undefined &&
    //   fulllengthImage === undefined &&
    //   closeupImage === undefined
    // ) {
    //   throw new ValidationError("No image files found in the request");
    // }

    // // Check if thes files are images
    // if (
    //   midlengthImage !== undefined &&
    //   midlengthImage.mimetype.startsWith("image/") === false
    // ) {
    //   throw new ValidationError("Midlength image is not an image file");
    // }

    // if (
    //   fulllengthImage !== undefined &&
    //   fulllengthImage.mimetype.startsWith("image/") === false
    // ) {
    //   throw new ValidationError("Fulllength image is not an image file");
    // }

    // if (
    //   closeupImage !== undefined &&
    //   closeupImage.mimetype.startsWith("image/") === false
    // ) {
    //   throw new ValidationError("Closeup image is not an image file");
    // }

    await modelApplicationService.addImages(
      modelApplicationId,
      (Array.isArray(images) ? images : [images]).map((image) => ({
        type: "polaroid",
        image,
      }))
    );
    // const [
    //   midlengthImageMetaData,
    //   fulllengthImageMetaData,
    //   closeupImageMetaData,
    // ] = await Promise.all([
    //   localFileService.saveFile(midlengthImage),
    //   localFileService.saveFile(fulllengthImage),
    //   localFileService.saveFile(closeupImage),
    // ]);

    // const modelApplication = await prisma.modelApplication.findUnique({
    //   where: { id: modelApplicationId, },
    //   include: {images: true}
    // });

    // if (modelApplication === null) {
    //   throw new NotFoundError("Model application not found");
    // }

    // if (modelApplication.status !== ModelApplicationStatus.PENDING) {
    //   throw new ConstraintViolationError("Model application is not pending");
    // }

    // if (modelApplication.images.length > 0){
    //   throw new ConstraintViolationError("Images already added to the model application");
    // }

    // await prisma.modelApplication.update({
    //   where: { id: modelApplicationId },
    //   data: {
    //     images: {
    //       createMany: {
    //         data: [
    //           {
    //             url: midlengthImageMetaData.url,
    //             type: "midlength",
    //             fileId: midlengthImageMetaData.id,
    //           },
    //           {
    //             url: fulllengthImageMetaData.url,
    //             type: "fulllength",
    //             fileId: fulllengthImageMetaData.id,
    //           },
    //           {
    //             url: closeupImageMetaData.url,
    //             type: "closeup",
    //             fileId: closeupImageMetaData.id,
    //           },
    //         ],
    //       },
    //     },
    //   },
    // });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function acceptModelApplicationController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const modelApplicationId = req.params.id;

    const model = await modelApplicationService.accept(modelApplicationId);

    // const modelApplication = await prisma.modelApplication.findUnique({
    //   where: {
    //     id: modelApplicationId,
    //     // status: { not: ModelApplicationStatus.ACCEPTED },
    //   },
    //   include: { images: true, experiences: true },
    // });

    // if (modelApplication === null) {
    //   throw new NotFoundError("Model application not found");
    // }

    // if (modelApplication.status === ModelApplicationStatus.ACCEPTED) {
    //   throw new ConstraintViolationError(
    //     "Model application is already accepted"
    //   );
    // }

    // await prisma.modelApplication.update({
    //   where: { id: modelApplicationId },
    //   data: {
    //     status: ModelApplicationStatus.ACCEPTED,
    //   },
    // });

    // const creatModelInput: Prisma.ModelCreateInput = {
    //   firstName: modelApplication.firstName,
    //   lastName: modelApplication.lastName,
    //   email: modelApplication.email,
    //   phoneNumber: modelApplication.phoneNumber,
    //   nickname: `${modelApplication.firstName} ${modelApplication.lastName
    //     .charAt(0)
    //     .toUpperCase()}.`,
    //   lineId: modelApplication.lineId,
    //   whatsapp: modelApplication.whatsapp,
    //   wechat: modelApplication.weChat,
    //   instagram: modelApplication.instagram,
    //   facebook: modelApplication.facebook,
    //   dateOfBirth: modelApplication.dateOfBirth,
    //   gender: modelApplication.gender,
    //   nationality: modelApplication.nationality,
    //   ethnicity: modelApplication.ethnicity,
    //   address: modelApplication.address,
    //   city: modelApplication.city,
    //   region: modelApplication.region,
    //   zipCode: modelApplication.zipCode,
    //   country: modelApplication.country,
    //   talents: modelApplication.talents,
    //   aboutMe: modelApplication.aboutMe,
    // };

    // const createModelMeasurementInput: Prisma.ModelMeasurementCreateWithoutModelInput =
    //   {
    //     height: modelApplication.height,
    //     weight: modelApplication.weight,
    //     bust: modelApplication.bust,
    //     hips: modelApplication.hips,
    //     suitDressSize: modelApplication.suitDressSize,
    //     shoeSize: modelApplication.shoeSize,
    //     eyeColor: modelApplication.eyeColor,
    //     hairColor: modelApplication.hairColor,
    //   };

    // const createModelImageInput: Prisma.ModelImageCreateWithoutModelInput[] =
    //   modelApplication.images.map((image) => ({
    //     type: image.type,
    //     url: image.url,
    //     fileId: image.fileId,
    //     caption: image.caption,
    //   }));

    // const createModelExperiencesInput: Prisma.ModelExperienceCreateWithoutModelInput[] =
    //   modelApplication.experiences.map((experience) => ({
    //     year: experience.year,
    //     media: experience.media,
    //     country: experience.country,
    //     product: experience.product,
    //     details: experience.details,
    //   }));
    // {
    // }

    // const model = await prisma.model.create({
    //   data: {
    //     ...creatModelInput,
    //     experiences: {
    //       create: createModelExperiencesInput,
    //     },
    //     measurement: {
    //       create: createModelMeasurementInput,
    //     },
    //     images: {
    //       create: createModelImageInput,
    //     },
    //   },
    //   include: { images: true, measurement: true, experiences: true },
    // });

    res.json(model);
  } catch (err) {
    next(err);
  }
}

export async function archiveModelApplicationController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const modelApplicationId = req.params.id;
    await modelApplicationService.archive(modelApplicationId);
    // // Check if the model application exists
    // const modelApplication = await prisma.modelApplication.findUnique({
    //   where: { id: modelApplicationId },
    // });

    // if (modelApplication === null) {
    //   throw new NotFoundError("Model application not found");
    // }

    // // Check if the model application is still pending
    // if (modelApplication.status === ModelApplicationStatus.ACCEPTED) {
    //   throw new ConstraintViolationError(
    //     "Model application is already accepted"
    //   );
    // }

    // // If model application is already archived, return
    // if (modelApplication.status === ModelApplicationStatus.ARCHIVED) {
    //   res.sendStatus(204);
    //   return;
    // }

    // // Archive the model application
    // await prisma.modelApplication.update({
    //   where: { id: modelApplicationId },
    //   data: { status: ModelApplicationStatus.ARCHIVED },
    // });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function getModelApplicationsController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const query = validate(req.query, ModelApplicationQuerySchema);

    const paginatedApplication = await modelApplicationService.getAll(query);

    // const where: Prisma.ModelApplicationWhereInput = {};
    // if (query.q !== undefined) {
    //   where.OR = [
    //     {
    //       firstName: {
    //         startsWith: query.q,
    //         mode: "insensitive",
    //       },
    //     },
    //     {
    //       email: {
    //         startsWith: query.q,
    //         mode: "insensitive",
    //       },
    //     },
    //   ];
    // }

    // if (query.from !== undefined) {
    //   where.createdAt = {
    //     gte: query.from,
    //   };
    // }

    // if (query.to !== undefined) {
    //   where.createdAt = {
    //     lte: query.to,
    //   };
    // }

    // if (query.status !== undefined) {
    //   where.status = { equals: query.status };
    // }

    // const page = query.page ?? 1;
    // const pageSize = query.pageSize ?? 10;

    // const [applications, total] = await Promise.all([
    //   prisma.modelApplication.findMany({
    //     where,
    //     skip: (page - 1) * pageSize,
    //     take: pageSize,
    //     include: { images: true, experiences: true },
    //   }),
    //   prisma.modelApplication.count({ where }),
    // ]);

    // const paginatedApplications: PaginatedData<ModelApplication> = {
    //   data: applications,
    //   total,
    //   totalPage: Math.ceil(total / pageSize),
    //   page: page,
    //   pageSize: pageSize,
    //   hasNextPage: total > page * pageSize,
    //   hasPreviousPage: page > 1,
    // };

    res.json(paginatedApplication);
  } catch (err) {
    next(err);
  }
}

export async function getModelApplicationController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const modelApplicationId = req.params.id;
    const modelApplication = await modelApplicationService.getById(
      modelApplicationId
    );
    res.json(modelApplication);
  } catch (err) {
    next(err);
  }
}
