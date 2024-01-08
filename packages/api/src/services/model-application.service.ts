import { inject, injectable } from "inversify";
import type { CreateModelInput, Model } from "../types/model";
import type {
    CreateModelApplicationInput,
    ModelApplication,
    ModelApplicationQuery,
} from "../types/model-application";
import type { PaginatedData } from "../types/paginated-data";
import { type Prisma, PrismaClient } from "@prisma/client";
import { TYPES } from "../inversify.config";
import { IEmailService } from "./email.service";
import { IModelService } from "./model.service";
import { InvalidArgumentError } from "../utils/errors/invalid-argument.error";
import { ModelApplicationStatus } from "../constants/model-application";
import ConstraintViolationError from "../utils/errors/conflict.error";

export interface IModelApplicationService {
    createApplication: (
        application: CreateModelApplicationInput
    ) => Promise<ModelApplication>;
    getApplicationById: (id: string) => Promise<ModelApplication | null>;
    getApplications: (
        query: ModelApplicationQuery
    ) => Promise<PaginatedData<ModelApplication>>;
    acceptApplication: (applicationId: string) => Promise<Model>;
    rejectApplication: (applicationId: string) => Promise<void>;
}

@injectable()
export class ModelApplicationService implements IModelApplicationService {
    @inject(TYPES.PRISMA)
    private readonly prisma!: PrismaClient;

    @inject(TYPES.EMAIL_SERVICE)
    private readonly mailService!: IEmailService;

    @inject(TYPES.MODEL_SERVICE)
    private readonly modelService!: IModelService;

    async createApplication(
        application: CreateModelApplicationInput
    ): Promise<ModelApplication> {
        // save applicaiton to database
        const savedApplication = await this.prisma.modelApplication.create({
            data: {
                ...application,
                experiences: {
                    create: application.experiences ?? [],
                },
                images: {
                    create: application.images ?? [],
                },
            },

            include: {
                experiences: true,
                images: true,
            },
        });
        // send email notifications along with application summary and link to application
        await this.mailService.sendEmail({
            to: ["example.com"], // TODO - get from config
            subject: "New Model Application",
            text: "New model application received",
            html: `<p>New model application received</p>
            <p>First Name: ${savedApplication.firstName}</p>
            <p>Last Name: ${savedApplication.lastName}</p>
            `,
        });

        return savedApplication;
    }

    async getApplicationById(id: string): Promise<ModelApplication | null> {
        // retrieve application from the database
        const application = await this.prisma.modelApplication.findUnique({
            where: { id },
            include: {
                experiences: true,
                images: true,
            },
        });

        return application;
    }

    async getApplications(
        query: ModelApplicationQuery
    ): Promise<PaginatedData<ModelApplication>> {
        // construct prisma where cluase from query
        const where: Prisma.ModelApplicationWhereInput = {};

        if (query.q !== undefined) {
            where.OR = [
                {
                    firstName: {
                        startsWith: query.q,
                    },
                },
                {
                    lastName: {
                        startsWith: query.q,
                    },
                },
                {
                    email: {
                        startsWith: query.q,
                    },
                },
            ];
        }

        if (query.from !== undefined) {
            where.AND = [
                ...(Array.isArray(where.AND) ? [...where.AND] : []),
                { createdAt: { gte: query.from } },
            ];
        }

        if (query.to !== undefined) {
            where.AND = [
                ...(Array.isArray(where.AND) ? [...where.AND] : []),
                { createdAt: { lte: query.to } },
            ];
        }

        if (query.status !== undefined) {
            where.AND = [
                ...(Array.isArray(where.AND) ? [...where.AND] : []),
                { status: { equals: query.status } },
            ];
        }

        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;

        // retrieve applications from the database
        const [applications, total] = await Promise.all([
            this.prisma.modelApplication.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    experiences: true,
                    images: true,
                },
            }),
            this.prisma.modelApplication.count({ where }),
        ]);

        // paginate applications
        const paginatedApplications: PaginatedData<ModelApplication> = {
            data: applications,
            total,
            totalPage: Math.ceil(total / pageSize),
            page,
            pageSize,
            hasNextPage: total > page * pageSize,
            hasPreviousPage: page > 1,
        };

        // return paginated applications
        return paginatedApplications;
    }

    async acceptApplication(applicationId: string): Promise<Model> {
        // retrieve applicatioh from database
        const application = await this.prisma.modelApplication.findUnique({
            where: { id: applicationId },
            include: {
                experiences: true,
                images: true,
            },
        });

        // if application does not exist throw an invalid argument error
        if (application === null) {
            throw new InvalidArgumentError("Application does not exist");
        }

        if (application.status !== ModelApplicationStatus.PENDING) {
            throw new ConstraintViolationError(
                "Application has already been finalized"
            );
        }

        const experiences: Prisma.ModelExperienceCreateWithoutModelInput[] = [];

        for (const experience of application.experiences) {
            const _experience: Prisma.ModelExperienceCreateWithoutModelInput = {
                year: experience.year,
                media: experience.media,
                product: experience.product,
                country: experience.country,
                details: experience.details,
            };
            experiences.push(_experience);
        }

        const images: Prisma.ModelImageCreateWithoutModelInput[] = [];

        for (const image of application.images) {
            const _image: Prisma.ModelImageCreateWithoutModelInput = {
                url: image.url,
                caption: image.caption,
                type: image.type,
                height: image.height,
                width: image.width,
            };
            images.push(_image);
        }

        const measurements: Prisma.ModelMeasurementCreateWithoutModelInput = {
            height: application.height,
            weight: application.weight,
            bust: application.bust,
            hips: application.hips,
            suitDressSize: application.suitDressSize,
            shoeSize: application.shoeSize,
            eyeColor: application.eyeColor,
            hairColor: application.hairColor,
        };

        // create model from application
        const model: CreateModelInput = {
            firstName: application.firstName,
            lastName: application.lastName,
            email: application.email,
            phoneNumber: application.phoneNumber,
            nickname: `${application.firstName} ${application.lastName
                .charAt(0)
                .toUpperCase()}.`,
            lineId: application.lineId,
            whatsApp: application.whatsApp,
            weChat: application.weChat,
            instagram: application.instagram,
            facebook: application.facebook,
            dateOfBirth: application.dateOfBirth,
            gender: application.gender,
            nationality: application.nationality,
            ethnicity: application.ethnicity,
            // countryOfResidence: string,
            // spokenLanguage: string
            // passportNo: string,
            // idCardNo: string,
            // taxId: string,
            // occupation: string,
            // highestLevelOfEducation: string,
            address: application.address,
            city: application.city,
            region: application.region,
            zipCode: application.zipCode,
            country: application.country,
            talents: application.talents,
            aboutMe: application.aboutMe,
            // medicalBackground: string
            // tattoos: string
            // scars: string
            // underwareShooting: boolean,
            experiences,
            images,
            measurements,
        };

        // save model to database
        const savedModel = await this.modelService.createModel(model);

        // mark application as accepted
        await this.prisma.modelApplication.update({
            where: { id: applicationId },
            data: {
                status: ModelApplicationStatus.ACCEPTED,
            },
        });

        // return model
        return savedModel;
    }

    async rejectApplication(applicationId: string): Promise<void> {
        // retrieve application from database
        const application = await this.prisma.modelApplication.findUnique({
            where: { id: applicationId },
        });

        // if application does not exist throw an invalid argument error
        if (application === null) {
            throw new InvalidArgumentError("Application does not exist");
        }

        if (application.status !== ModelApplicationStatus.PENDING) {
            throw new ConstraintViolationError(
                "Application has already been finalized"
            );
        }

        // mark application as rejected
        await this.prisma.modelApplication.update({
            where: {
                id: applicationId,
            },
            data: {
                status: ModelApplicationStatus.REJECTED,
            },
        });
    }
}
