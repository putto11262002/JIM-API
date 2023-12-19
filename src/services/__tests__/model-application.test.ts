import "reflect-metadata";
import { Container } from "inversify";
import {
    type IModelApplicationService,
    ModelApplicationService,
} from "../model-application.service";
import { TYPES } from "../../inversify.config";

import type {
    CreateModelApplicationInput,
    ModelApplication,
    ModelApplicationQuery,
} from "../../types/model-application";
import { ModelApplicationStatus } from "../../constants/model-application";
import type { Model } from "../../types/model";
import { InvalidArgumentError } from "../../utils/errors/invalid-argument.error";

describe("modelApplicationService", () => {
    let container: Container;
    let modelApplicationService: IModelApplicationService;

    const modelServiceMock = {
        createModel: jest.fn(),
    };

    const prismaMock = {
        modelApplication: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
        },
    };

    const emailServiceMock = {
        sendEmail: jest.fn(),
    };

    beforeEach(() => {
        container = new Container();
        container.bind(TYPES.MODEL_SERVICE).toConstantValue(modelServiceMock);
        container.bind(TYPES.PRISMA).toConstantValue(prismaMock);
        container.bind(TYPES.EMAIL_SERVICE).toConstantValue(emailServiceMock);
        modelApplicationService = container.resolve(ModelApplicationService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const inputApplication: CreateModelApplicationInput = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "123456789",
        email: "johndoe@example.com",
        lineId: "johndoe",
        weChat: "johndoe",
        facebook: "johndoe",
        instagram: "johndoe",
        whatsApp: "johndoe",
        dateOfBirth: new Date(),
        gender: "male",
        nationality: "Thai",
        ethnicity: "Thai",
        address: "123/456",
        city: "Bangkok",
        region: "Bangkok",
        zipCode: "12345",
        country: "Thailand",
        talents: ["talent1", "talent2"],
        aboutMe: "I am John Doe",
        height: "180",
        weight: "80",
        bust: "90",
        hips: "90",
        suitDressSize: "M",
        shoeSize: "42",
        eyeColor: "black",
        hairColor: "black",
        experiences: {
            create: [
                {
                    year: 2020,
                    product: "product1",
                    media: "media1",
                    details: "details1",
                    country: "country1",
                },
            ],
        },
        images: {
            create: [
                {
                    type: "headshot",
                    caption: "caption1",
                    url: "url1",
                    height: 100,
                    width: 100,
                },
            ],
        },
    };

    const savedApplication: ModelApplication = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "123456789",
        email: "johndoe@example.com",
        lineId: "johndoe",
        weChat: "johndoe",
        facebook: "johndoe",
        instagram: "johndoe",
        whatsApp: "johndoe",
        dateOfBirth: new Date(),
        gender: "male",
        nationality: "Thai",
        ethnicity: "Thai",
        address: "123/456",
        city: "Bangkok",
        region: "Bangkok",
        zipCode: "12345",
        country: "Thailand",
        talents: ["talent1", "talent2"],
        aboutMe: "I am John Doe",
        height: "180",
        weight: "80",
        bust: "90",
        hips: "90",
        suitDressSize: "M",
        shoeSize: "42",
        eyeColor: "black",
        hairColor: "black",
        experiences: [
            {
                id: "1",
                year: 2020,
                product: "product1",
                media: "media1",
                details: "details1",
                country: "country1",
                applicationId: "1",
            },
        ],

        images: [
            {
                id: "1",
                type: "headshot",
                caption: "caption1",
                url: "url1",
                height: 100,
                width: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
                applicationId: "1",
            },
        ],
        status: ModelApplicationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    describe("createApplication", () => {
        it("should create a new model application and send notification emails", async () => {
            emailServiceMock.sendEmail.mockResolvedValue(undefined);
            prismaMock.modelApplication.create.mockResolvedValue(
                savedApplication
            );
            const createdApplication =
                await modelApplicationService.createApplication(
                    inputApplication
                );
            expect(createdApplication).toEqual(savedApplication);
            // Expect mail to be sent once
            expect(emailServiceMock.sendEmail).toHaveBeenCalledTimes(1);
            // Expect model to be created once
            expect(prismaMock.modelApplication.create).toHaveBeenCalledTimes(1);
            // Expect model to be creataed with the following details
            expect(prismaMock.modelApplication.create).toHaveBeenCalledWith({
                data: inputApplication,
                include: {
                    experiences: true,
                    images: true,
                },
            });
        });
    });

    describe("getApplicationById", () => {
        it("Should return the application if the id is valid", async () => {
            const applicationId = savedApplication.id;
            prismaMock.modelApplication.findUnique.mockResolvedValue(
                savedApplication
            );
            const application =
                await modelApplicationService.getApplicationById(applicationId);

            expect(application).toEqual(savedApplication);
            expect(
                prismaMock.modelApplication.findUnique
            ).toHaveBeenCalledTimes(1);
            expect(prismaMock.modelApplication.findUnique).toHaveBeenCalledWith(
                {
                    where: { id: applicationId },
                    include: { experiences: true, images: true },
                }
            );
        });

        it("Should return null if the id is invalid", async () => {
            const randomApplicationId = "randomId";
            prismaMock.modelApplication.findUnique.mockResolvedValue(null);
            const application =
                await modelApplicationService.getApplicationById(
                    randomApplicationId
                );
            expect(application).toBeNull();
            expect(
                prismaMock.modelApplication.findUnique
            ).toHaveBeenCalledTimes(1);
            expect(prismaMock.modelApplication.findUnique).toHaveBeenCalledWith(
                {
                    where: { id: randomApplicationId },
                    include: { experiences: true, images: true },
                }
            );
        });
    });

    describe("getApplications", () => {
        it("Should return paginated application", async () => {
            const query: ModelApplicationQuery = {
                q: "searchString",
                status: ModelApplicationStatus.PENDING,
                from: new Date(),
                to: new Date(),
                page: 1,
                pageSize: 2,
            };

            const savedApplications = [
                savedApplication,
                { ...savedApplication, id: "2" },
                { ...savedApplication, id: "3" },
            ];
            prismaMock.modelApplication.findMany.mockResolvedValue(
                savedApplications
            );

            prismaMock.modelApplication.count.mockResolvedValue(3);

            const paginatedApplication =
                await modelApplicationService.getApplications(query);

            expect(paginatedApplication).toEqual({
                data: savedApplications,
                total: 3,
                totalPage: 2,
                page: 1,
                pageSize: 2,
                hasNextPage: true,
                hasPreviousPage: false,
            });

            expect(prismaMock.modelApplication.findMany).toHaveBeenCalledTimes(
                1
            );

            expect(prismaMock.modelApplication.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
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
                    ],
                    AND: [
                        {
                            createdAt: {
                                gte: query.from,
                            },
                        },
                        {
                            createdAt: {
                                lte: query.to,
                            },
                        },
                        {
                            status: {
                                equals: query.status,
                            },
                        },
                    ],
                },
                skip: 0,
                take: 2,
                include: {
                    experiences: true,
                    images: true,
                },
            });
        });
    });

    describe("acceptApplication", () => {
        it("Should mark application as accepted and create a new model if application id is valid", async () => {
            const applicationId = savedApplication.id;
            prismaMock.modelApplication.findUnique.mockResolvedValue(
                savedApplication
            );
            // TODO - complete the model atttributes
            const createdModel: Partial<Model> = {
                id: "1",
                firstName: savedApplication.firstName,
                lastName: savedApplication.lastName,
            };
            modelServiceMock.createModel.mockResolvedValue(createdModel);
            prismaMock.modelApplication.update.mockResolvedValue(undefined);
            const model =
                await modelApplicationService.acceptApplication(applicationId);
            expect(
                prismaMock.modelApplication.findUnique
            ).toHaveBeenCalledTimes(1);
            expect(prismaMock.modelApplication.findUnique).toHaveBeenCalledWith(
                {
                    where: { id: applicationId },
                    include: {
                        experiences: true,
                        images: true,
                    },
                }
            );
            expect(modelServiceMock.createModel).toHaveBeenCalledTimes(1);
            expect(prismaMock.modelApplication.update).toHaveBeenCalledTimes(1);
            expect(prismaMock.modelApplication.update).toHaveBeenCalledWith({
                where: { id: applicationId },
                data: { status: ModelApplicationStatus.ACCEPTED },
            });
            expect(model).toEqual(createdModel);
        });

        it("Should throw an InvalidArgumentError if the application id is invalid", async () => {
            const invalidId = "randomId";
            prismaMock.modelApplication.findUnique.mockResolvedValue(null);
            await expect(
                modelApplicationService.acceptApplication(invalidId)
            ).rejects.toThrow(InvalidArgumentError);
            expect(
                prismaMock.modelApplication.findUnique
            ).toHaveBeenCalledTimes(1);
            expect(prismaMock.modelApplication.findUnique).toHaveBeenCalledWith(
                {
                    where: { id: invalidId },
                    include: { experiences: true, images: true },
                }
            );
            expect(modelServiceMock.createModel).toHaveBeenCalledTimes(0);
            expect(prismaMock.modelApplication.update).toHaveBeenCalledTimes(0);
        });

        it("Should throw an InvalidArgumentError if the application has been finalised", async () => {
            const validId = savedApplication.id;
            prismaMock.modelApplication.findUnique.mockResolvedValue({
                ...savedApplication,
                status: ModelApplicationStatus.ACCEPTED,
            });
            await expect(
                modelApplicationService.acceptApplication(validId)
            ).rejects.toThrow(InvalidArgumentError);

            prismaMock.modelApplication.findUnique.mockResolvedValue({
                ...savedApplication,
                status: ModelApplicationStatus.REJECTED,
            });
            await expect(
                modelApplicationService.acceptApplication(validId)
            ).rejects.toThrow(InvalidArgumentError);
        });
    });

    describe("rejectApplication", () => {
        it("Should mark application as rejected if application id is valid", async () => {
            const validId = savedApplication.id;
            prismaMock.modelApplication.findUnique.mockResolvedValue(
                savedApplication
            );
            prismaMock.modelApplication.update.mockResolvedValue(undefined);
            await modelApplicationService.rejectApplication(validId);
            expect(
                prismaMock.modelApplication.findUnique
            ).toHaveBeenCalledTimes(1);
            expect(prismaMock.modelApplication.findUnique).toHaveBeenCalledWith(
                { where: { id: validId } }
            );
            expect(prismaMock.modelApplication.update).toHaveBeenCalledTimes(1);
            expect(prismaMock.modelApplication.update).toHaveBeenCalledWith({
                where: { id: validId },
                data: { status: ModelApplicationStatus.REJECTED },
            });
        });

        it("Should throw an InvalidArgumentError if the application id is invalid", async () => {
            const invalidId = "randomId";
            prismaMock.modelApplication.findUnique.mockResolvedValue(null);
            await expect(
                modelApplicationService.rejectApplication(invalidId)
            ).rejects.toThrow(InvalidArgumentError);
            expect(
                prismaMock.modelApplication.findUnique
            ).toHaveBeenCalledTimes(1);
            expect(prismaMock.modelApplication.findUnique).toHaveBeenCalledWith(
                { where: { id: invalidId } }
            );
            expect(prismaMock.modelApplication.update).toHaveBeenCalledTimes(0);
        });

        it("Should throw an InvalidArgumentError if the application has already been finalised", async () => {
            const validId = savedApplication.id;
            prismaMock.modelApplication.findUnique.mockResolvedValue({
                ...savedApplication,
                status: ModelApplicationStatus.ACCEPTED,
            });
            await expect(
                modelApplicationService.rejectApplication(validId)
            ).rejects.toThrow(InvalidArgumentError);

            prismaMock.modelApplication.findUnique.mockResolvedValue({
                ...savedApplication,
                status: ModelApplicationStatus.REJECTED,
            });
            await expect(
                modelApplicationService.rejectApplication(validId)
            ).rejects.toThrow(InvalidArgumentError);
        });
    });
});
