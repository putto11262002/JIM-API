import { ModelApplication, ModelApplicationCreateInput, PaginatedData, ModelApplicationStatus, ModelCreateInput, Model, ModelApplicationGetQuery } from "@jimmodel/shared";
import { prisma } from "../prisma";
import NotFoundError from "../lib/errors/not-found-error";
import ConstraintViolationError from "../lib/errors/constraint-violation-error";
import localFileService from "./local-file-service";
import modelService from "./model-service";
import { buildPaginatedData } from "../lib/paginated-data";
import { Prisma } from "@prisma/client";
import sharp from "sharp";

export type ModelApplicationAddImagesInput = {type: string, image: Express.Multer.File}[]

export interface IModelApplicationService {
    create: (modelApplication: ModelApplicationCreateInput) => Promise<ModelApplication>;
    addImages: (modelApplicationId: string, images: ModelApplicationAddImagesInput) => Promise<void>;
    accept: (modelApplicationId: string) => Promise<Model>;
    archive: (modelApplicationId: string) => Promise<void>;
    getAll: (query: ModelApplicationGetQuery) => Promise<PaginatedData<ModelApplication>>;
    getById: (id: string) => Promise<ModelApplication>;
}

async function getById(id: string): Promise<ModelApplication> {
    const modelApplication = await prisma.modelApplication.findUnique({
        where: {id},
        include: {experiences: true, images: true}
    })

    if (modelApplication === null){
        throw new NotFoundError("Model application not found")
    }

    return modelApplication;

  }

async function create(modelApplicationInput: ModelApplicationCreateInput): Promise<ModelApplication> {
    const modelApplication = await prisma.modelApplication.create({
        data: {
            ...modelApplicationInput,
            experiences: {
                create: modelApplicationInput.experiences
            },
            status: ModelApplicationStatus.PENDING
        },
        include: {experiences: true, images: true}
    })
    return modelApplication;
}

async function addImages(modelApplicationId: string, images: ModelApplicationAddImagesInput): Promise<void>{
    const modelApplication = await prisma.modelApplication.findUnique({
        where: {id: modelApplicationId},
        include: {images: true}
    })

    if (modelApplication === null){
        throw new NotFoundError("Model application not found")
    }

    if (modelApplication.status !== ModelApplicationStatus.PENDING){
        throw new ConstraintViolationError("Model application is not pending")
    }

    if (modelApplication.images.length > 0){
        throw new ConstraintViolationError("Images already added to the model application")
    }

    for (let i =0; i <  images.length; i++){
      await sharp(images[i].image.path).resize(600, 600).toFormat("jpeg").toFile(images[i].image.destination + "/resized-" + images[i].image.filename)
      images[i].image.path = images[i].image.destination + "/resized-" + images[i].image.filename
    }


    const savedIamges = await Promise.all(images.map(async(image) => {
        const savedImage = await localFileService.saveFile(image.image)
        return {
            url: savedImage.url,
            type: image.type,
            fileId: savedImage.id
        }
    }))

    

    await prisma.modelApplication.update({
        where: {id: modelApplicationId},
        data: {
            images: {
                createMany: {
                    data: savedIamges
                }
            }
        }
    })

}

async function accept(modelApplicationId: string): Promise<Model>{
    const modelApplication = await prisma.modelApplication.findUnique({
        where: {
            id: modelApplicationId
        },
        include: {experiences: true, images: true}
    })

    if (modelApplication === null){
        throw new NotFoundError("Model application not found")
    }

    if (modelApplication.status === ModelApplicationStatus.ACCEPTED){
        throw new ConstraintViolationError("Model application is already accepted")
    }

    await prisma.modelApplication.update({
        where: {id: modelApplicationId},
        data: {
            status: ModelApplicationStatus.ACCEPTED
        }
    })


    const creatModelInput: ModelCreateInput = {
      firstName: modelApplication.firstName,
      lastName: modelApplication.lastName,
      email: modelApplication.email,
      phoneNumber: modelApplication.phoneNumber,
      nickname: `${modelApplication.firstName} ${modelApplication.lastName
        .charAt(0)
        .toUpperCase()}.`,
      lineId: modelApplication.lineId,
      whatsapp: modelApplication.whatsapp,
      wechat: modelApplication.wechat,
      instagram: modelApplication.instagram,
      facebook: modelApplication.facebook,
      dateOfBirth: modelApplication.dateOfBirth,
      gender: modelApplication.gender,
      nationality: modelApplication.nationality,
      ethnicity: modelApplication.ethnicity,
      address: modelApplication.address,
      city: modelApplication.city,
      region: modelApplication.region,
      zipCode: modelApplication.zipCode,
      country: modelApplication.country,
      talents: modelApplication.talents,
      aboutMe: modelApplication.aboutMe,
        height: modelApplication.height,
        weight: modelApplication.weight,
        bust: modelApplication.bust,
        hips: modelApplication.hips,
        suitDressSize: modelApplication.suitDressSize,
        shoeSize: modelApplication.shoeSize,
        eyeColor: modelApplication.eyeColor,
        hairColor: modelApplication.hairColor,
      
    };

    const model = await modelService.create(
        creatModelInput,
    )

    for (const image of modelApplication.images){
      const fileMetaData = await localFileService.getFileMetaData(image.fileId)
        await modelService.addImage(model.id, {image: fileMetaData, type: image.type})
    }

    for(const experience of modelApplication.experiences){
        await modelService.addExperience(model.id, {
          product: experience.product,
          year: experience.year,
          media: experience.media,
          country: experience.country,
          details: experience.details
        })
    }

    return model;
}

async function archive(modelApplicationId: string): Promise<void> {
    const modelApplication = await prisma.modelApplication.findUnique({
        where: { id: modelApplicationId },
      });
  
      if (modelApplication === null) {
        throw new NotFoundError("Model application not found");
      }
  
      // Check if the model application is still pending
      if (modelApplication.status === ModelApplicationStatus.ACCEPTED) {
        throw new ConstraintViolationError("Model application is already accepted");
      }
  
      // If model application is already archived, return
      if (modelApplication.status === ModelApplicationStatus.ARCHIVED) {
        return;
      }
  
      // Archive the model application
      await prisma.modelApplication.update({
        where: { id: modelApplicationId },
        data: { status: ModelApplicationStatus.ARCHIVED },
      });
}


 async function getAll(query: ModelApplicationGetQuery): Promise<PaginatedData<ModelApplication>> {
    const where: Prisma.ModelApplicationWhereInput = {};
    if (query.q !== undefined) {
      where.OR = [
        {
          firstName: {
            startsWith: query.q,
            mode: "insensitive"
          },
        },
        {
          email: {
            startsWith: query.q,
            mode: "insensitive"
          },
        },
      ];
    }

    if (query.from !== undefined) {
      where.createdAt = {
        gte: query.from,
      };
    }

    if (query.to !== undefined) {
      where.createdAt = {
        lte: query.to,
      };
    }

    if (query.status !== undefined) {
      where.status = { equals: query.status };
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [applications, total] = await Promise.all([
      prisma.modelApplication.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { images: true, experiences: true },
        
      }),
      prisma.modelApplication.count({ where }),
    ]);

    const paginatedApplication = buildPaginatedData(applications, page, pageSize, total)

    return paginatedApplication;

 }



 const modelApplicationService: IModelApplicationService = {
    create,
    addImages,
    accept,
    archive,
    getAll,
    getById
}


export default modelApplicationService;
